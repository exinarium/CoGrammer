import { EmailRepository } from '../repositories/email-repository';
import { EmailDataModel } from '../models/email-datamodel';
import { EmailResponse, ResponseStatus, EmailMessage } from '../../../../email.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ObjectID } from 'mongodb';

export class EmailAggregate {
    private repository: EmailRepository;

    constructor(repository: EmailRepository) {
        this.repository = repository;
    }

    async doAsync(message: EmailMessage<EmailDataModel>): Promise<EmailResponse> {
        try {
            if (message.data) {
                const result = await this.repository.doAsync(message);

                message.id = new ObjectID(message.id);

                if (result) {
                    const response = new EmailResponse(
                        message?.id?.toHexString(),
                        'Email request success',
                        ResponseStatus.success,
                        200,
                        { result }
                    );

                    return response;
                } else {
                    const response = new EmailResponse(
                        message?.id?.toHexString(),
                        'Email request failure',
                        ResponseStatus.failure,
                        400,
                        { result }
                    );

                    return response;
                }
            } else {
                const ERROR_MESSAGE = 'Message data is invalid';

                const response = new EmailResponse(
                    message?.id?.toHexString(),
                    ERROR_MESSAGE,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in Email producer';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
