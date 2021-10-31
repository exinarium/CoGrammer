import { LoggingResponse } from '../../../../logging.dto';
import { LogPriority } from '../models/log-priority';

export interface ILoggingProducerAggregate {
    logAsync(message: string, error: Error, priority: LogPriority): Promise<LoggingResponse>;
}
