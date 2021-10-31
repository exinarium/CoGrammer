import express from 'express';
import { AuthenticationController } from './controllers/authentication-controller.js';
import { AuthenticationAggregate } from './domain/aggregates/authentication-aggregate';
import { AuthenticationRepository } from './domain/repositories/authentication-repository';
import { Config } from './domain/config/config';
import Configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { AuthenticationMapping } from './domain/mapping/authentication-mapping';
import { AuthenticationValidation } from './domain/validation/authentication-validation';
import { AuthenticationDbConfig } from './domain/config/authentication-db-config.js';
import { KeyRepository } from './domain/repositories/key-repository.js';
import { TokenValidationOptions } from './domain/config/token-validation-options.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 8080; // default port to listen

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType: any) => {
    process.on(eventType, () => {
        server.close(() => {
            // tslint:disable-next-line:no-console
            console.log('\n\nStop signal received');
            process.exit(0);
        });
    });
});

// Define services
const databaseConfig = new AuthenticationDbConfig(
    Configuration.databaseConfig.databaseName,
    Configuration.databaseConfig.userCollectionName,
    Configuration.databaseConfig.organizationCollectionName,
    Configuration.databaseConfig.connectionString
);

const configurationDatabase = new DBConfig(
    Configuration.configurationDatabase.databaseName,
    Configuration.configurationDatabase.collectionName,
    Configuration.configurationDatabase.connectionString
);

const tokenValidationOptions = new TokenValidationOptions(
    Configuration.tokenValidationOptions.issuer,
    Configuration.tokenValidationOptions.subject,
    Configuration.tokenValidationOptions.audience,
    Configuration.tokenValidationOptions.expiresIn,
    Configuration.tokenValidationOptions.algorithm
);

const config = new Config(databaseConfig, configurationDatabase, tokenValidationOptions);
const repository = new AuthenticationRepository(config);
const mapper = new AuthenticationMapping();
const validation = new AuthenticationValidation();
const keyRepository = new KeyRepository(config);
const aggregate = new AuthenticationAggregate(repository, validation, mapper, keyRepository, config);

// define a route handler for the default home page
app.post('/api/v1/authentication', async (req, res) => {
    const request = req.body;

    const controller = new AuthenticationController(aggregate);
    const result = await controller.doAsync(request);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
