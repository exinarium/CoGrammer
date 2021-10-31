import { LoggingMessage, LoggingResponse } from '../../../../logging.dto/src';
import { LoggingDataModel } from '../../domain/models/logging-datamodel';
import { LogPriority } from '../models/log-priority';

export interface ILoggingMapping {
    map(message: string, error: Error, priority: LogPriority): Promise<LoggingMessage<LoggingDataModel>>;
}
