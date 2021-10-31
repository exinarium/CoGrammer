import { LoggingProducer } from './logging-producer';
import { LogPriority } from './domain/models/log-priority';

export = {
    LoggingProducer: new LoggingProducer(),
    LogPriority,
};
