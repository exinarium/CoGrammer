import { DBConfig } from './db-config';

export class AuthenticationDbConfig {
    constructor(
        public databaseName: string,
        public userCollectionName: string,
        public organizationCollectionName: string,
        public connectionString: string
    ) {}
}
