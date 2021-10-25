import { ElementCoordinates, Neighbor } from './mapping.model'

export class Endpoint {
  name: string;
  request: any;
  payload?: any;
  response: any;
}

export class Technology {
  name: string;
}

export class Server {
  key: string;
  name: string;
  coordinates?: ElementCoordinates;
  neighbors?: Neighbor[];
  endpoints?: Endpoint[];
  database?: string;
  repository?: string;
  technologies?: Technology[];
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

export class Step {
  server: string;
  algo?: Algo;
  request?: Request;
  response?: Response;
}

export class Scenario {
  name: string;
  tags?: string[];
  steps: Step[];
}
