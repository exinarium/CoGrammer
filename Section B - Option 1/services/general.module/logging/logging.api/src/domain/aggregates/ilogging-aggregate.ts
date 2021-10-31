import { LoggingResponse, LoggingRequest } from '../../../../logging.dto';

export interface ILoggingProducerAggregate {
    logAsync(data: LoggingRequest): Promise<LoggingResponse>;
}
