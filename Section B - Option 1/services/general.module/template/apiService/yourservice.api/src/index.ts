import express from 'express';
import { YourServiceController } from './controllers/yourservice-controller.js';
import { YourServiceAggregate } from './domain/aggregates/yourservice-aggregate';
import { YourServiceRepository } from './domain/repositories/yourservice-repository';
import { Config } from './domain/config/config';
import Configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { YourServiceMapping } from './domain/mapping/yourservice-mapping';
import { YourServiceValidation } from './domain/validation/yourservice-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ObjectID } from 'mongodb';
import { StatusCode } from './domain/enums/status-code.js';
import { ResponseStatus } from './domain/enums/response-status.js';

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

// Define services
const databaseConfig = new DBConfig(
    Configuration.databaseConfig.databaseName,
    Configuration.databaseConfig.collectionName,
    Configuration.databaseConfig.connectionString
);

const config = new Config(databaseConfig);
const repository = new YourServiceRepository(config);
const mapper = new YourServiceMapping();
const validation = new YourServiceValidation();
const aggregate = new YourServiceAggregate(repository, validation, mapper);

// define a route handler for the default home page
app.post('/createyourservice', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new YourServiceController(aggregate);
        const result = await controller.createAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The yourservice requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/updateyourservice', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new YourServiceController(aggregate);
        const result = await controller.updateAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The yourservice requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/deleteyourservice/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new YourServiceController(aggregate);
            const result = await controller.deleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The yourservice id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The yourservice requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/undeleteyourservice/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new YourServiceController(aggregate);
            const result = await controller.undeleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The yourservice id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The yourservice requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.get('/yourservicelookup/:requestId/:start/:limit/:searchString?/:id?', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');
    const searchString = req.param('searchString');
    const start = Number(req.param('start')) && Number(req.param('start')) >= 0 ? Number(req.param('start')) : 0;
    const limit = Number(req.param('limit')) && Number(req.param('limit')) >= 1 ? Number(req.param('limit')) : 1;

    if (requestId && requestId !== '') {
        const controller = new YourServiceController(aggregate);
        const result = await controller.lookupAsync(id, searchString, start, limit, user, requestId);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The yourservice requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
