export interface IAggregate {
    WriteAPIMetricsToDatabase(
        req: any,
        reqTimestamp: string,
        res: any,
        resTimestamp: string,
        requestDuration: number
    ): void;
    ProcessAPIMetrics(requestDuration: number, responseStatus: number): void;
    ProcessConsumerMetrics(executionDuration: number, executionStatus: number): void;
}
