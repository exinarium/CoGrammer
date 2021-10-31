import { LoggingMessage, LoggingResponse } from '../../../../logging.dto';
import { LoggingDataModel } from '../../domain/models/logging-datamodel';

export interface ILoggingMessageBus {
    produceMessage(message: LoggingMessage<LoggingDataModel>): Promise<boolean>;
}
