import { Server } from 'src/app/models/documentation.model'

export interface ServerState {
    servers: Server[];
    cpt: number;
}
