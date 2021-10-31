import { DBConfig } from './db-config';
import { PayfastConfig } from './payfast-config';

export class Config {
    constructor(public databaseConfig: DBConfig, public payfastConfig: PayfastConfig) { }
}
