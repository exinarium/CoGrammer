import { LoggingResponse } from '../../logging.dto/src/responses/logging-response';
import { LogPriority } from './domain/models/log-priority';

export interface ILoggingProducer {
    logAsync(message: string, error: Error, priority: LogPriority): Promise<LoggingResponse>;
}
