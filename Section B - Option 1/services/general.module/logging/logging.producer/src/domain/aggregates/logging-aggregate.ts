import { ILoggingProducerAggregate } from './ilogging-aggregate';
import { ILoggingMapping } from '../mapping/ilogging-mapping';
import { LoggingResponse, ResponseStatus } from '../../../../logging.dto/src';
import { ILoggingMessageBus } from '../messageBus/ilogging-message-bus';
import { LogPriority } from '../models/log-priority';

export class LoggingAggregate implements ILoggingProducerAggregate {
    private mapping: ILoggingMapping;
    private messageBus: ILoggingMessageBus;

    constructor(mapping: ILoggingMapping, messageBus: ILoggingMessageBus) {
        this.mapping = mapping;
        this.messageBus = messageBus;
    }

    async logAsync(message: string, error: Error, priority: LogPriority): Promise<LoggingResponse> {
        try {
            const produceMessage = await this.mapping.map(message, error, priority);
            const result = await this.messageBus.produceMessage(produceMessage);

            if (result) {
                const response = new LoggingResponse(
                    produceMessage?.id?.toHexString(),
                    'Log produced successfully',
                    ResponseStatus.success,
                    200,
                    {}
                );

                return response;
            } else {

                throw new Error("Producing message failed in MessageBus");
            }
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while producing a message in the logging producer: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);

            throw ex;
        }
    }
}
