import express from 'express';
import { GoogleSheetIntegrationController } from './controllers/googlesheetintegration-controller.js';
import { GoogleSheetIntegrationAggregate } from './domain/aggregates/googlesheetintegration-aggregate';
import Configuration from './configuration.json';
import { GoogleSheetIntegrationValidation } from './domain/validation/googlesheetintegration-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { GoogleConfig } from './domain/config/google-config.js';
import { Config } from './domain/config/config.js';
import { GoogleTokenRepository } from './domain/repositories/googletoken-repository.js';
import { google } from 'googleapis';
import { GoogleSheetIntegrationRepository } from './domain/repositories/googlesheetintegration-repository.js';

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

const googleConfig = new GoogleConfig(
    Configuration.googleConfig.clientSecret,
    Configuration.googleConfig.clientId,
    Configuration.googleConfig.redirectUrl);

const config = new Config(googleConfig, Configuration.connectionString);

const validation = new GoogleSheetIntegrationValidation();
const googleTokenRespository = new GoogleTokenRepository(config);
const googleDatabaseRespository = new GoogleSheetIntegrationRepository(config);
const aggregate = new GoogleSheetIntegrationAggregate(validation, googleTokenRespository, googleDatabaseRespository, config);

// define a route handler for the default home page
app.post('/api/v1/googlesheetintegration', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    const controller = new GoogleSheetIntegrationController(aggregate);
    const result = await controller.doAsync(request, user);

    res.status(result.code).send(result);
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
