import { EmailRequest, EmailResponse, ResponseStatus } from '../../../email.dto/src';
import { EmailAggregate } from '../domain/aggregates/email-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class EmailController {
    constructor(private _aggregate: EmailAggregate) {}

    async doAsync(request: EmailRequest): Promise<EmailResponse> {
        try {
            const response = await this._aggregate.doAsync(request);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing aggregation logic in Email API: Request Id: ${request.id}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return new EmailResponse(
                request.id,
                'An error occurred inside the Email controller and the request could not be processed',
                ResponseStatus.failure,
                500,
                {}
            );
        }
    }
}
