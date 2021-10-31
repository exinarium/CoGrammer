import express from 'express';
import { CandidateInteractionController } from './controllers/candidateinteraction-controller.js';
import { CandidateInteractionAggregate } from './domain/aggregates/candidateinteraction-aggregate';
import { CandidateInteractionRepository } from './domain/repositories/candidateinteraction-repository';
import { Config } from './domain/config/config';
import Configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { CandidateInteractionMapping } from './domain/mapping/candidateinteraction-mapping';
import { CandidateInteractionValidation } from './domain/validation/candidateinteraction-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ObjectID } from 'mongodb';
import { StatusCode } from './domain/enums/status-code.js';
import { ResponseStatus } from './domain/enums/response-status.js';
import bodyParser from 'body-parser';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
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
const repository = new CandidateInteractionRepository(config);
const mapper = new CandidateInteractionMapping();
const validation = new CandidateInteractionValidation();
const aggregate = new CandidateInteractionAggregate(repository, validation, mapper);

// define a route handler for the default home page
app.post('/api/v1/createcandidateinteraction', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new CandidateInteractionController(aggregate);
        const result = await controller.createAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The candidateinteraction requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/api/v1/updatecandidateinteraction', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new CandidateInteractionController(aggregate);
        const result = await controller.updateAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The candidateinteraction requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/deletecandidateinteraction/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new CandidateInteractionController(aggregate);
            const result = await controller.deleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The candidateinteraction id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The candidateinteraction requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/undeletecandidateinteraction/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new CandidateInteractionController(aggregate);
            const result = await controller.undeleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The candidateinteraction id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The candidateinteraction requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.get('/api/v1/candidateinteractionlookup/:requestId/:candidateProfileId/:start/:limit/:isAdmin/:searchString?/:id?', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');
    const searchString = req.param('searchString');
    const start = Number(req.param('start')) && Number(req.param('start')) >= 0 ? Number(req.param('start')) : 0;
    const limit = Number(req.param('limit')) && Number(req.param('limit')) >= 1 ? Number(req.param('limit')) : 1;
    const isAdmin = req.param('isAdmin') === "true";
    const candidateProfileId = req.param('candidateProfileId');

    if (requestId && requestId !== '') {
        const controller = new CandidateInteractionController(aggregate);
        const result = await controller.lookupAsync(id, searchString, start, limit, user, requestId, isAdmin, candidateProfileId);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The candidateinteraction requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
