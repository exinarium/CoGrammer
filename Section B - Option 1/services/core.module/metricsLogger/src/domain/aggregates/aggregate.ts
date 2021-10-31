import { IAggregate } from './iaggregate';
import { IRepository } from '../repositories/irepository';
import { IMapping } from '../mapping/imapping';

export class Aggregate implements IAggregate {
    constructor(private repository: IRepository, private prometheus: any, private mapper: IMapping) {}

    async WriteAPIMetricsToDatabase(
        req: any,
        reqTimestamp: string,
        res: any,
        resTimestamp: string,
        requestDuration: number
    ): Promise<void> {
        const model = this.mapper.map(req, res, resTimestamp, reqTimestamp, requestDuration);

        this.repository.WriteAsync(model);
    }

    async ProcessAPIMetrics(requestDuration: number, responseStatus: number): Promise<void> {
        this.prometheus.increaseRequestCount();
        this.prometheus.writeCurrentResonseDuration(requestDuration);
        this.prometheus.writeTotalResonseDuration(requestDuration);
        this.prometheus.writeResponseStatus(responseStatus);
    }

    async ProcessConsumerMetrics(executionDuration: number, executionStatus: number): Promise<void> {
        this.prometheus.increaseProcessCount();
        this.prometheus.writeCurrentProcessingDuration(executionDuration);
        this.prometheus.writeTotalProcessingDuration(executionDuration);
        this.prometheus.writeProcessStatus(executionStatus);
    }
}
