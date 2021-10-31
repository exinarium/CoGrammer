import { DBConfig } from './db-config';
import { MessageBusConfig } from './message-bus-config';

export class Config {
    constructor(public messageBusConfig: MessageBusConfig, public databaseConfig: DBConfig[]) {}
}
