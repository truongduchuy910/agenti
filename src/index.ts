import { concatMap, from, Subject, filter } from "rxjs";
import ignore from "ignore";
import { minimatch } from "minimatch";
import path from "path";
import fs from "fs";
import { uniq } from "lodash";
import chokidar from "chokidar";
import type { AgentEvent, AgentOptions } from "./types";

export function watch({ projects, wildcards }: AgentOptions): void {
  const subject = new Subject<AgentEvent>();
  subject
    .pipe(
      concatMap((event) =>
        from(wildcards).pipe(
          filter((wildcard) => minimatch(event.path, wildcard.condition)),
          concatMap((wildcard) => {
            const relative = path.relative(event.project, event.path);
            const parsed = path.parse(relative);

            return from(
              wildcard.processor({
                data: { wildcard, event },
                relative,
                parse: parsed,
              }),
            );
          }),
        ),
      ),
    )
    .subscribe();

  uniq(projects).map((project: string) => {
    if (!fs.existsSync(path.join(project, ".gitignore"))) {
      chokidar
        .watch(project, {})
        .on("all", (event, path) => subject.next({ event, path, project }));
    } else {
      const gitignore = fs.readFileSync(
        path.join(project, ".gitignore"),
        "utf8",
      );
      const ig = ignore().add(gitignore);
      chokidar
        .watch(project, {
          ignored: (current) => {
            const relative = path.relative(project, current);
            if (relative.startsWith(".")) return true;
            return relative.length ? ig.ignores(relative) : false;
          },
        })
        .on("all", (event, path) => subject.next({ event, path, project }));
    }
  });
}
