import express from 'express';
import { UserController } from './controllers/user-controller.js';
import { UserAggregate } from './domain/aggregates/user-aggregate';
import { UserRepository } from './domain/repositories/user-repository';
import { Config } from './domain/config/config';
import Configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { UserMapping } from './domain/mapping/user-mapping';
import { UserValidation } from './domain/validation/user-validation';
import MetricsLogger from 'covidscreener-metricslogger';
import { validateJWT } from 'covidscreener-authentication-jwt';
import { ObjectID } from 'mongodb';
import { StatusCode } from './domain/enums/status-code.js';
import { ResponseStatus } from './domain/enums/response-status.js';
import { verify } from 'crypto';

const app = express();
const metricslogger = new MetricsLogger(Configuration, true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req: any, res: any, next: any) => {
    metricslogger.apiMetrics(
        res,
        req,
        () => {
            if (req.url === '/api/v1/verify' || req.url === '/api/v1/forgot-password') {
                next();
            } else {
                validateJWT(req, res, next, Configuration.roles);
            }
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
const repository = new UserRepository(config);
const mapper = new UserMapping();
const validation = new UserValidation();
const aggregate = new UserAggregate(repository, validation, mapper);

// define a route handler for the default home page
app.post('/api/v1/createuser', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.createAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/api/v1/updateuser', async (req, res) => {
    const user = res.locals.user;
    const request = req.body;

    if (request.requestId && request.requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.updateAsync(request, user);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/deleteuser/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new UserController(aggregate);
            const result = await controller.deleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The user id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.delete('/api/v1/undeleteuser/:requestId/:id', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');

    if (requestId && requestId !== '') {
        if (id && id !== '') {
            const controller = new UserController(aggregate);
            const result = await controller.undeleteAsync(id, user, requestId);

            res.status(result.code).send(result);
        } else {
            res.status(StatusCode.badRequest).send({
                responseId: new ObjectID(),
                message: 'The user id parameter cannot be empty',
                status: ResponseStatus.failure,
            });
        }
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.get('/api/v1/userlookup/:requestId/:start/:limit/:searchString?/:id?', async (req, res) => {
    const user = res.locals.user;
    const id = req.param('id');
    const requestId = req.param('requestId');
    const searchString = req.param('searchString');
    const start = Number(req.param('start')) && Number(req.param('start')) >= 0 ? Number(req.param('start')) : 0;
    const limit = Number(req.param('limit')) && Number(req.param('limit')) >= 1 ? Number(req.param('limit')) : 1;

    if (requestId && requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.lookupAsync(id, searchString, start, limit, user, requestId);

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.post('/api/v1/verify', async (req, res) => {
    const requestId = req.param('requestId');
    const verifyCode = req.param('verifyCode');
    const newPassword = req.param('newPassword');
    const confirmPassword = req.param('confirmPassword');

    if (requestId && requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.verifyAccount(
            requestId && requestId !== '' ? new ObjectID(requestId) : undefined,
            verifyCode,
            newPassword,
            confirmPassword
        );

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.post('/api/v1/forgot-password', async (req, res) => {
    const requestId = req.param('requestId');
    const forgotPasswordCode = req.param('forgotPasswordCode');
    const emailAddress = req.param('emailAddress');
    const newPassword = req.param('newPassword');
    const confirmPassword = req.param('confirmPassword');

    if (requestId && requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.forgotPassword(
            requestId && requestId !== '' ? new ObjectID(requestId) : undefined,
            forgotPasswordCode,
            newPassword,
            confirmPassword,
            emailAddress
        );

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

app.put('/api/v1/update-password', async (req, res) => {
    const user = res.locals.user;
    const requestId = req.param('requestId');
    const currentPassword = req.param('currentPassword');
    const newPassword = req.param('newPassword');
    const confirmPassword = req.param('confirmPassword');

    if (requestId && requestId !== '') {
        const controller = new UserController(aggregate);
        const result = await controller.updatePassword(
            requestId && requestId !== '' ? new ObjectID(requestId) : undefined,
            user,
            newPassword,
            confirmPassword,
            currentPassword
        );

        res.status(result.code).send(result);
    } else {
        res.status(StatusCode.badRequest).send({
            responseId: new ObjectID(),
            message: 'The user requestId cannot be empty',
            status: ResponseStatus.failure,
        });
    }
});

// start the Express server
const server = app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
