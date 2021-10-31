import { DBConfig } from './db-config';
import { MessageBusConfig } from './message-bus-config';
import { GoogleConfig } from './google-config';

export class Config {
    constructor(public messageBusConfig: MessageBusConfig, public databaseConfig: DBConfig, public googleConfig: GoogleConfig) {}
}
