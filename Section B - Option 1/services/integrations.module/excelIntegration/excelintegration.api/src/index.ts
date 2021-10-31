import express from 'express';
import { ExcelIntegrationController } from './controllers/excelintegration-controller.js';
import { ExcelIntegrationAggregate } from './domain/aggregates/excelintegration-aggregate';
import Configuration from './configuration.json';
import { ExcelIntegrationMapping } from './domain/mapping/excelintegration-mapping';
import { ExcelIntegrationValidation } from './domain/validation/excelintegration-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ExcelIntegrationResponse, ResponseStatus } from '../../excelintegration.dto/src/index.js';
import { ObjectID } from 'mongodb';
import { unlinkSync } from 'fs';
import { DBConfig } from './domain/config/db-config.js';
import { ExcelIntegrationRepository } from './domain/repositories/excelintegration-repository.js';
import { Config } from './domain/config/config.js';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            if (req.method === "POST") {
                validateJWT(req, res, next, Configuration.roles);
            } else if (req.method === "GET") {
                next();
            }
        },
        Configuration
    );
});

const port = 8002; // default port to listen

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
    Configuration.databaseConfig.connectionString);

const repository = new ExcelIntegrationRepository(new Config(databaseConfig));
const mapper = new ExcelIntegrationMapping();
const validation = new ExcelIntegrationValidation();
const aggregate = new ExcelIntegrationAggregate(validation, mapper, repository);

// define a route handler for the default home page
app.post('/api/v1/excelintegration', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (user.isAdminUser) {
        const controller = new ExcelIntegrationController(aggregate);
        const result = await controller.doAsync(request, user);

        res.status(result.code).send(result);

    } else {

        res.status(403).send(new ExcelIntegrationResponse(
            new ObjectID().toHexString(),
            'You do not have the rights to access this feature',
            ResponseStatus.failure,
            403,
            undefined));
    }
});

app.get('/api/v1/excelintegration/:filepath', async (req, res) => {
    const filepath = req.param('filepath');

    if(filepath && filepath !== '') {

        const path = Configuration.fileRootPath;
        res.download(`${path}${filepath}`, (err) => {
            if(!err) {
                unlinkSync(`${path}${filepath}`);
            } else {
                res.status(404).send();
            }
        })
    } else {
        res.status(404).send();
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
