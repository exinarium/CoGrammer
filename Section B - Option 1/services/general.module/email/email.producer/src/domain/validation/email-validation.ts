import { EmailResponse } from '../../../dist/email.dto/src/';
import { ResponseStatus } from '../../../dist/email.dto/src/';
import { EmailEvent } from '../../../dist/email.dto/src';
import { EmailDataModel } from '../../domain/models/email-datamodel';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class EmailValidation {
    async validate(event: EmailEvent<EmailDataModel>): Promise<EmailResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            let response: EmailResponse;
            if (!event) {
                return new EmailResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {

                if(!event?.data?.from || event?.data?.from === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a from address.';
                }

                if(!event?.data?.to || event?.data?.to.length <= 0) {

                    valid = false;
                    returnMessage += '\nPlease provide valid to addresses.';
                }

                if(!event?.data?.subject || event?.data?.subject === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid subject';
                }

                if(!event?.data?.message || event?.data?.message === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid message';
                }
            }

            if (!valid) {
                response = new EmailResponse(
                    event?.id?.toHexString(),
                    returnMessage,
                    ResponseStatus.failure,
                    400,
                    {}
                );

                return response;
            }

            response = new EmailResponse(
                event?.id?.toHexString(),
                'Event data is valid',
                ResponseStatus.success,
                200,
                {}
            );

            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
