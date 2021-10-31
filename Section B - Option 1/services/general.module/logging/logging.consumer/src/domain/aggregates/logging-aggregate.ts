import { ILoggingProducerAggregate } from './ilogging-aggregate';
import { ILoggingRepository } from '../repositories/ilogging-repository';
import { LoggingDataModel } from '../models/logging-datamodel';
import { LoggingResponse, ResponseStatus, LoggingMessage } from '../../../../logging.dto/src';
import { ObjectId, ObjectID } from 'mongodb';

export class LoggingAggregate implements ILoggingProducerAggregate {
    private repository: ILoggingRepository;

    constructor(repository: ILoggingRepository) {
        this.repository = repository;
    }

    async doAsync(message: LoggingMessage<LoggingDataModel>): Promise<LoggingResponse> {
        try {
            if (message) {
                const result = await this.repository.doAsync(message);

                message.id = new ObjectID(message.id)

                if (result) {
                    const response = new LoggingResponse(
                        message?.id?.toHexString(),
                        'Message consumed successfully',
                        ResponseStatus.success,
                        200,
                        {}
                    );

                    return response;
                } else {
                    const response = new LoggingResponse(
                        message?.id?.toHexString(),
                        'Message failed to be consumed successfully',
                        ResponseStatus.failure,
                        500,
                        {}
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = `Message data is invalid`;
                // tslint:disable-next-line:no-console
                console.log(ERROR_MESSAGE);

                const response = new LoggingResponse(
                    message?.id?.toHexString(),
                    'Message data invalid',
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = `An error occurred while consuming a message in the logging consumer: ${ex}`;
            // tslint:disable-next-line:no-console
            console.log(ERROR_MESSAGE);

            throw ex;
        }
    }
}
