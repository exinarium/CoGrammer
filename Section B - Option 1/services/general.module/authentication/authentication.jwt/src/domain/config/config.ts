import { DBConfig } from './db-config';
import { TokenValidationOptions } from './token-validation-options';

export class Config {
    constructor(public configurationDatabase: DBConfig, public tokenValidationOptions: TokenValidationOptions) {}
}
