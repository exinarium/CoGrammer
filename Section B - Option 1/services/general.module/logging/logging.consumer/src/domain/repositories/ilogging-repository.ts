import { LoggingMessage } from '../../../../logging.dto/src';
import { LoggingDataModel } from '../models/logging-datamodel';

export interface ILoggingRepository {
    doAsync(event: LoggingMessage<LoggingDataModel>): Promise<boolean>;
}
