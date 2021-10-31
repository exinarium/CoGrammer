import { Prometheus } from './prometheus';
import client, { Gauge, Counter } from 'prom-client';
import { ResponseStatus } from './reponse-status';

export class PrometheusApi extends Prometheus {
    private responseDuration: Gauge<string>;
    private totalResponseDuration: Counter<string>;
    private totalRequestCount: Counter<string>;

    private totalRequestStatusOK: Counter<string>;
    private totalRequestStatusCreated: Counter<string>;
    private totalRequestStatusNoData: Counter<string>;
    private totalRequestStatusBadRequest: Counter<string>;
    private totalRequestStatusUnauthorized: Counter<string>;
    private totalRequestStatusForbidden: Counter<string>;
    private totalRequestStatusNotFound: Counter<string>;
    private totalRequestStatusMethodNotAllowed: Counter<string>;
    private totalRequestStatusUnsupportedMediaType: Counter<string>;
    private totalRequestStatusInternalServerError: Counter<string>;

    constructor(config: any) {
        super(config);
        this.setupMetrics();
    }

    setupMetrics() {
        this.responseDuration = new client.Gauge({
            name: 'current_response_duration',
            help: 'The current response duration',
        });

        this.totalResponseDuration = new client.Counter({
            name: 'total_response_duration',
            help: 'The total response duration',
        });

        this.totalRequestCount = new client.Counter({
            name: 'total_request_count',
            help: 'The current request count',
        });

        this.totalRequestStatusOK = new client.Counter({
            name: 'total_request_status_OK',
            help: 'The total request status of type 200',
        });

        this.totalRequestStatusCreated = new client.Counter({
            name: 'total_request_status_Created',
            help: 'The total request status of type 201',
        });

        this.totalRequestStatusNoData = new client.Counter({
            name: 'total_request_status_No_Data',
            help: 'The total request status of type 204',
        });

        this.totalRequestStatusBadRequest = new client.Counter({
            name: 'total_request_status_Bad_Request',
            help: 'The total request status of type 400',
        });

        this.totalRequestStatusUnauthorized = new client.Counter({
            name: 'total_request_status_Unauthorized',
            help: 'The total request status of type 401',
        });

        this.totalRequestStatusForbidden = new client.Counter({
            name: 'total_request_status_Forbidden',
            help: 'The total request status of type 403',
        });

        this.totalRequestStatusNotFound = new client.Counter({
            name: 'total_request_status_Not_Found',
            help: 'The total request status of type 404',
        });

        this.totalRequestStatusMethodNotAllowed = new client.Counter({
            name: 'total_request_status_Method_Not_Allowed',
            help: 'The total request status of type 405',
        });

        this.totalRequestStatusUnsupportedMediaType = new client.Counter({
            name: 'total_request_status_Unsupported_Media_Type',
            help: 'The total request status of type 415',
        });

        this.totalRequestStatusInternalServerError = new client.Counter({
            name: 'total_request_status_Internal_Server_Error',
            help: 'The total request status of type 500',
        });
    }

    writeCurrentResonseDuration(duration: number): void {
        this.responseDuration.set(duration);
        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.responseDuration;
        });
    }

    writeTotalResonseDuration(duration: number): void {
        this.totalResponseDuration.inc(duration);
        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.totalResponseDuration;
        });
    }

    writeResponseStatus(code: ResponseStatus): void {
        switch (code) {
            case ResponseStatus.OK: {
                this.totalRequestStatusOK.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusOK;
                });

                break;
            }
            case ResponseStatus.No_Data: {
                this.totalRequestStatusNoData.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusNoData;
                });

                break;
            }
            case ResponseStatus.Created: {
                this.totalRequestStatusCreated.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusCreated;
                });

                break;
            }
            case ResponseStatus.Bad_Request: {
                this.totalRequestStatusBadRequest.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusBadRequest;
                });

                break;
            }
            case ResponseStatus.Unauthorized: {
                this.totalRequestStatusUnauthorized.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusUnauthorized;
                });

                break;
            }
            case ResponseStatus.Forbidden: {
                this.totalRequestStatusForbidden.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusForbidden;
                });

                break;
            }
            case ResponseStatus.Not_Found: {
                this.totalRequestStatusNotFound.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusNotFound;
                });

                break;
            }
            case ResponseStatus.Method_Not_Allowed: {
                this.totalRequestStatusMethodNotAllowed.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusMethodNotAllowed;
                });

                break;
            }
            case ResponseStatus.Unsupported_Media_Type: {
                this.totalRequestStatusUnsupportedMediaType.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusUnsupportedMediaType;
                });

                break;
            }
            case ResponseStatus.Internal_Server_Error: {
                this.totalRequestStatusInternalServerError.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalRequestStatusInternalServerError;
                });

                break;
            }
        }
    }

    increaseRequestCount(): void {
        this.totalRequestCount.inc(1);

        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.totalRequestCount;
        });
    }
}
