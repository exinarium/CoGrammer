import { EmailRequest, EmailResponse, ResponseStatus } from '../../../../email.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import axios from 'axios';
import qs from 'qs';
import { Config } from '../config/config';

export class EmailValidation {

    constructor(private config: Config) { }

    async validate(request: EmailRequest): Promise<EmailResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new EmailResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {

                if (!request?.from || request?.from === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a from address.';
                }

                if (!request?.name || request?.name === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid name';
                }

                if (!request?.subject || request?.subject === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid subject';
                }

                if (!request?.message || request?.message === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid message';
                }

                if (!request?.recaptchaKey || request?.recaptchaKey === '') {

                    valid = false;
                    returnMessage += '\nPlease provide a valid recaptcha key';
                } else {

                    const requestBody = {
                        secret: this.config.recaptchaSecret,
                        response: request.recaptchaKey
                    }

                    const headers = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }

                    const verifyResponse = await axios.post(this.config.googleVerifyUrl, qs.stringify(requestBody), headers);

                    if (verifyResponse?.data?.success === false) {
                        valid = false;
                        returnMessage += '\nPlease provide a valid recaptcha key';
                    }
                }
            }

            if (!valid) {
                return new EmailResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new EmailResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
