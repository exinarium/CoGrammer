import { ILoggingProducerAggregate } from './ilogging-aggregate';
import { LoggingResponse, ResponseStatus, LoggingRequest } from '../../../../logging.dto/src';
import { LoggingProducer } from 'covidscreener-logging/dist/logging.producer/src';

export class LoggingAggregate implements ILoggingProducerAggregate {
    async logAsync(request: LoggingRequest): Promise<LoggingResponse> {
        try {
            if (request.message !== undefined && request.priority <= 2 && request.priority >= 0) {
                const resultEvent = await LoggingProducer.logAsync(request.message, request.error, request.priority);

                return resultEvent;
            } else {
                return new LoggingResponse(request.id, 'Invalid request object', ResponseStatus.failure, 400, {});
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in Logging API: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);

            throw ex;
        }
    }
}
