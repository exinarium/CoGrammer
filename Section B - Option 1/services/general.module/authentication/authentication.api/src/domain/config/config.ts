import { DBConfig } from './db-config';
import { AuthenticationDbConfig } from './authentication-db-config';
import { TokenValidationOptions } from './token-validation-options';

export class Config {
    constructor(
        public databaseConfig: AuthenticationDbConfig,
        public configurationDatabase: DBConfig,
        public tokenValidationOptions: TokenValidationOptions
    ) {}
}
