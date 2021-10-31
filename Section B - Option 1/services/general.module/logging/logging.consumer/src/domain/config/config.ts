import { DBConfig } from './db-config';

export class Config {
    private _databaseConfig: DBConfig;
    private _topic: string;

    constructor(databaseConfig: DBConfig, topic: string) {
        this._databaseConfig = databaseConfig;
        this._topic = topic;
    }

    get databaseConfig(): DBConfig {
        return this._databaseConfig;
    }

    get topic(): string {
        return this._topic;
    }
}
