export class DBConfig {

    private dbName: string;
    private dbCollection: string;
    private dbConnectionString: string;

    constructor(config: any) {

        this.dbName = config.databaseName;
        this.dbCollection = config.collectionName;
        this.dbConnectionString = config.connectionString;
    }

    get databaseName(): string {

        return this.dbName;
    }

    get collectionName(): string {

        return this.dbCollection;
    }

    get connectionString(): string {

        return this.dbConnectionString;
    }


}