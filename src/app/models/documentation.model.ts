import { ElementCoordinates, Neighbor } from './mapping.model'

export class Endpoint {
  id?:number
  name: string;
  request: string;
  payload: string;
  response: string;
  active?: boolean;
}

export class Server {
  id?: number;
  key: string;
  name: string;
  coordinates?: ElementCoordinates;
  neighbors?: Neighbor[];
  endpoints?: Endpoint[];
  database?: string;
  repository?: string;
  technologies?: string[];
  color?: string;
  active?: boolean;
}

export class Link {
  from: Server;
  to: Server;
  endpoint?: Endpoint;
  active?: boolean;
}

export class Request {
  target: string;
  endpoint: string;
}

export class Response {
  target: string;
  endpoint: string;
}

export class Algo {
  title: string;
  description: string;
}
export class IncludedScenario {
  scenario: string;
  active?: boolean
}

export class Step {
  id?: number;
  includedScenario?: IncludedScenario;
  server?: string;
  algo?: Algo;
  request?: Request;
  response?: Response;
  active?:boolean
  isIncluded?: number
}

export class Scenario {
  id?: number;
  name: string;
  key?: string;
  tags?: string[];
  steps: Step[];
  computedSteps: Step[];
  active?: boolean;
}
