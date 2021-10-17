import { ScenarioState } from "./scenario/scenario.state";
import { ServerState } from "./server/server.state";

export interface DocumentationState {
    servers: ServerState;
    scenarios: ScenarioState;
}