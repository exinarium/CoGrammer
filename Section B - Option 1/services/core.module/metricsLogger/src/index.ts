import { Aggregate } from './domain/aggregates/aggregate';
import { Repository } from './domain/repositories/repository';
import { Prometheus } from './domain/prometheus/prometheus';
import client, { Registry } from 'prom-client';
import { IAggregate } from './domain/aggregates/iaggregate';
import { IRepository } from './domain/repositories/irepository';
import { IPrometheus } from './domain/prometheus/iprometheus';
import { PrometheusProcess } from './domain/prometheus/prometheus-process';
import { PrometheusApi } from './domain/prometheus/prometheus-api';
import { IMapping } from './domain/mapping/imapping';
import { Mapping } from './domain/mapping/mapping';
import { createBrotliCompress } from 'zlib';

export default class MetricsLogger {
    private aggregate: IAggregate;
    private repository: IRepository;
    private prometheus: Prometheus;
    private mapper: IMapping;

    constructor(config: any, isApi: boolean) {
        if (isApi) {
            this.prometheus = new PrometheusApi(config);
        } else {
            this.prometheus = new PrometheusProcess(config);
        }

        this.repository = new Repository(config);
        this.mapper = new Mapping();
        this.aggregate = new Aggregate(this.repository, this.prometheus, this.mapper);
    }

    apiMetrics(res: any, req: any, next: any, config: any) {
        const requestTimestamp = Date();
        const requestTimestampMs = Date.now();
        const chunks: Buffer[] = [];
        const resSend = res.send;

        res.send = (data: any) => {
            const responseTimestamp = Date();
            const responseTimestampMs = Date.now();
            const requestDuration = responseTimestampMs - requestTimestampMs;
            const responseCode = res.statusCode;

            res.body = data;

            this.aggregate.WriteAPIMetricsToDatabase(req, requestTimestamp, res, responseTimestamp, requestDuration);
            this.aggregate.ProcessAPIMetrics(requestDuration, responseCode);

            res.send = resSend;
            res.send(data);
        };

        next();
    }

    async processMetrics(next: any): Promise<boolean> {
        const startExecutionTimestamp = Date.now();
        const result = await next;

        const endExecutionTimestamp = Date.now();
        const processDuration = endExecutionTimestamp - startExecutionTimestamp;

        this.aggregate.ProcessConsumerMetrics(processDuration, result);

        return true;
    }
}
