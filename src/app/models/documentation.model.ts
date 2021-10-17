import {ElementCoordinates, Neighbor} from './mapping.model';


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
  between: Server[];
  from: Server;
  to: Server;
  endpoint?: Endpoint;
  active?: boolean;
}

export class Scenario {
  name: string;
  tags?: string[];
  steps: Step[];
}

export class Step {
  server: string;
  algo?: Algo;
  request?: Request;
  response?: Response;
}

export class Algo {
  title: string;
  description: string;
}

export class Request {
  target: string;
  endpoint: string|Endpoint;
}

export class Response {
  target: string|Server;
}

export class Endpoint {
  key: string;
  request: any;
  response: any;
}

export class Technology {
  name: string;
}