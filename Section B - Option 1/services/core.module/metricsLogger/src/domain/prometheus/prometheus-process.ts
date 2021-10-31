import { Prometheus } from './prometheus';
import client, { Gauge, Counter } from 'prom-client';
import { ResponseStatus } from './reponse-status';

export class PrometheusProcess extends Prometheus {
    private processDuration: Gauge<string>;
    private maxProcessDuration: Gauge<string>;
    private minProcessDuration: Gauge<string>;
    private totalProcessDuration: Counter<string>;
    private totalProcessCount: Counter<string>;

    private totalProcessStatusOK: Counter<string>;
    private totalProcessStatusCreated: Counter<string>;
    private totalProcessStatusNoData: Counter<string>;
    private totalProcessStatusBadRequest: Counter<string>;
    private totalProcessStatusUnauthorized: Counter<string>;
    private totalProcessStatusForbidden: Counter<string>;
    private totalProcessStatusNotFound: Counter<string>;
    private totalProcessStatusMethodNotAllowed: Counter<string>;
    private totalProcessStatusUnsupportedMediaType: Counter<string>;
    private totalProcessStatusInternalServerError: Counter<string>;

    constructor(config: any) {
        super(config);
        this.setupMetrics();
    }

    setupMetrics() {
        this.processDuration = new client.Gauge({
            name: 'current_Process_duration',
            help: 'The current Process duration',
        });

        this.totalProcessDuration = new client.Counter({
            name: 'total_Process_duration',
            help: 'The total Process duration',
        });

        this.totalProcessCount = new client.Counter({
            name: 'Process_count',
            help: 'The current Process count',
        });

        this.totalProcessStatusOK = new client.Counter({
            name: 'total_process_status_OK',
            help: 'The total process status of type 200',
        });

        this.totalProcessStatusCreated = new client.Counter({
            name: 'total_process_status_Created',
            help: 'The total process status of type 201',
        });

        this.totalProcessStatusNoData = new client.Counter({
            name: 'total_process_status_No_Data',
            help: 'The total process status of type 204',
        });

        this.totalProcessStatusBadRequest = new client.Counter({
            name: 'total_process_status_Bad_Request',
            help: 'The total process status of type 400',
        });

        this.totalProcessStatusUnauthorized = new client.Counter({
            name: 'total_process_status_Unauthorized',
            help: 'The total process status of type 401',
        });

        this.totalProcessStatusForbidden = new client.Counter({
            name: 'total_process_status_Forbidden',
            help: 'The total process status of type 403',
        });

        this.totalProcessStatusNotFound = new client.Counter({
            name: 'total_process_status_Not_Found',
            help: 'The total process status of type 404',
        });

        this.totalProcessStatusMethodNotAllowed = new client.Counter({
            name: 'total_process_status_Method_Not_Allowed',
            help: 'The total process status of type 405',
        });

        this.totalProcessStatusUnsupportedMediaType = new client.Counter({
            name: 'total_process_status_Unsupported_Media_Type',
            help: 'The total process status of type 415',
        });

        this.totalProcessStatusInternalServerError = new client.Counter({
            name: 'total_process_status_Internal_Server_Error',
            help: 'The total process status of type 500',
        });
    }

    writeCurrentProcessingDuration(duration: number): void {
        this.processDuration.set(duration);
        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.processDuration;
        });
    }

    writeTotalProcessingDuration(duration: number): void {
        this.totalProcessDuration.inc(duration);
        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.totalProcessDuration;
        });
    }

    writeProcessStatus(code: ResponseStatus): void {
        switch (code) {
            case ResponseStatus.OK: {
                this.totalProcessStatusOK.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusOK;
                });

                break;
            }
            case ResponseStatus.No_Data: {
                this.totalProcessStatusNoData.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusNoData;
                });

                break;
            }
            case ResponseStatus.Created: {
                this.totalProcessStatusCreated.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusCreated;
                });

                break;
            }
            case ResponseStatus.Bad_Request: {
                this.totalProcessStatusBadRequest.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusBadRequest;
                });

                break;
            }
            case ResponseStatus.Unauthorized: {
                this.totalProcessStatusUnauthorized.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusUnauthorized;
                });

                break;
            }
            case ResponseStatus.Forbidden: {
                this.totalProcessStatusForbidden.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusForbidden;
                });

                break;
            }
            case ResponseStatus.Not_Found: {
                this.totalProcessStatusNotFound.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusNotFound;
                });

                break;
            }
            case ResponseStatus.Method_Not_Allowed: {
                this.totalProcessStatusMethodNotAllowed.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusMethodNotAllowed;
                });

                break;
            }
            case ResponseStatus.Unsupported_Media_Type: {
                this.totalProcessStatusUnsupportedMediaType.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusUnsupportedMediaType;
                });

                break;
            }
            case ResponseStatus.Internal_Server_Error: {
                this.totalProcessStatusInternalServerError.inc(1);
                this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
                    body = this.totalProcessStatusInternalServerError;
                });

                break;
            }
        }
    }

    increaseProcessCount(): void {
        this.totalProcessCount.inc(1);

        this.gateway.pushAdd({ jobName: this.applicationName }, (err, resp, body) => {
            body = this.totalProcessCount;
        });
    }
}
