import { EmailResponse, ResponseStatus, EmailRequest } from '../../../../email.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { EmailProducer } from 'covidscreener-email/dist/'
import { EmailValidation } from '../validation/email-validation';
import { EmailMapping } from '../mapping/email-mapping';

export class EmailAggregate {
    constructor(
        private validation: EmailValidation,
        private mapper: EmailMapping
    ) { }

    async doAsync(request: EmailRequest): Promise<EmailResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const supportEvent = await this.mapper.mapToSupportEvent(request);
            const resultSupportEvent = await new EmailProducer().produceAsync(supportEvent);

            const clientEvent = await this.mapper.mapToClientEvent(request);
            const resultClientEvent = await new EmailProducer().produceAsync(clientEvent);

            if (resultSupportEvent && resultClientEvent) {
                const response = new EmailResponse(
                    request.id,
                    'Email request success',
                    ResponseStatus.success,
                    200,
                    { resultSupportEvent, resultClientEvent }
                );

                return response;
            } else {
                const response = new EmailResponse(
                    request.id,
                    'Email request failure',
                    ResponseStatus.failure,
                    500,
                    { resultSupportEvent, resultClientEvent }
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in Email API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
