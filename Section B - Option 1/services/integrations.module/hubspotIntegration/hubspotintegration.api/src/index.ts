import express from 'express';
import { HubspotIntegrationController } from './controllers/hubspotintegration-controller.js';
import { HubspotIntegrationAggregate } from './domain/aggregates/hubspotintegration-aggregate';
import Configuration from './configuration.json';
import { HubspotIntegrationValidation } from './domain/validation/hubspotintegration-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { DBConfig } from './domain/config/dbconfig.js';
import { Config } from './domain/config/config.js';
import { HubspotIntegrationRepository } from './domain/repositories/hubspotintegration-repository.js';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            validateJWT(req, res, next, Configuration.roles);
        },
        Configuration
    );
});

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

const databaseConfig = new DBConfig(
    Configuration.databaseConfig.databaseName,
    Configuration.databaseConfig.collectionName,
    Configuration.databaseConfig.connectionString
);

const config = new Config(databaseConfig);
const validation = new HubspotIntegrationValidation();
const repository = new HubspotIntegrationRepository(config);
const aggregate = new HubspotIntegrationAggregate(validation, repository);

// define a route handler for the default home page
app.post('/api/v1/hubspotintegration', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new HubspotIntegrationController(aggregate);
    const result = await controller.doAsync(request, user);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
