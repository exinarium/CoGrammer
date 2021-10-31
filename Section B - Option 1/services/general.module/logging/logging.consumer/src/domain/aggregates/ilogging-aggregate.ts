import { LoggingResponse, LoggingMessage } from '../../../../logging.dto/src';
import { LoggingDataModel } from '../models/logging-datamodel';

export interface ILoggingProducerAggregate {
    doAsync(data: LoggingMessage<LoggingDataModel>): Promise<LoggingResponse>;
}
