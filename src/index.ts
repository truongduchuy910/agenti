import { concatMap, from, Subject, filter } from "rxjs";
import ignore from "ignore";
import { minimatch } from "minimatch";
import path from "path";
import fs from "fs";
import { uniq } from "lodash";
import chokidar, { type FSWatcher } from "chokidar";
import type { AgentEvent, AgentOptions } from "./types";

export function watch({
  projects,
  wildcards,
  subject,
}: AgentOptions): FSWatcher[] {
  if (!subject) subject = new Subject<AgentEvent>();
  subject
    .pipe(
      concatMap((event) =>
        from(wildcards).pipe(
          filter((wildcard) => minimatch(event.path, wildcard.condition)),
          concatMap((wildcard) => {
            const relative = path.relative(event.project, event.path);

            return from(
              wildcard.processor({
                data: { wildcard, event },
                relative,
                parse: path.parse(relative),
              }),
            );
          }),
        ),
      ),
    )
    .subscribe();

  return uniq(projects).map((project) => {
    if (!fs.existsSync(path.join(project, ".gitignore"))) {
      return chokidar
        .watch(project, {})
        .on("all", (event, path) => subject.next({ event, path, project }));
    }

    // read and ignore files
    const gitignore = fs.readFileSync(path.join(project, ".gitignore"), "utf8");
    const ig = ignore().add(gitignore);

    return chokidar
      .watch(project, {
        ignored: (current) => {
          const relative = path.relative(project, current);
          if (relative.startsWith(".")) return true;
          return relative.length ? ig.ignores(relative) : false;
        },
      })
      .on("all", (event, path) => subject.next({ event, path, project }));
  });
}
