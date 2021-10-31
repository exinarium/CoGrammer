import { ILoggingMapping } from './ilogging-mapping';
import { LoggingMessage } from '../../../../logging.dto/src';
import { LoggingDataModel } from '../../domain/models/logging-datamodel';
import { ObjectID } from 'mongodb';
import { LogPriority } from '../models/log-priority';

export class LoggingMapping implements ILoggingMapping {
    async map(message: string, error: Error, priority: LogPriority): Promise<LoggingMessage<LoggingDataModel>> {
        const datamodel = new LoggingDataModel(message, error, priority);
        const producerMessage = new LoggingMessage<LoggingDataModel>(
            ObjectID.createFromTime(Date.now()),
            datamodel,
            1,
            new Date()
        );

        return producerMessage;
    }
}
