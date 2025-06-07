import { type Subject } from "rxjs";

export interface AgentWildcard {
  name: string;
  condition: string;
  processor(data: AgentData): Promise<void>;
}

export interface AgentOptions {
  projects: string[];
  wildcards: AgentWildcard[];
  subject?: Subject<AgentEvent>;
}

export interface AgentEvent {
  event: string;
  path: string;
  project: string;
}

export interface AgentData {
  data: {
    event: AgentEvent;
    wildcard: AgentWildcard;
  };
  relative: string;
  parse: {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  };
}
