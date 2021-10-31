import { IAuthenticationValidation } from './iauthentication-validation';
import { AuthenticationRequest, AuthenticationResponse, ResponseStatus } from '../../../../authentication.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuthenticationValidation implements IAuthenticationValidation {
    async validate(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        try {
            let valid = true;
            let returnMessage = '';

            if (!request) {
                return new AuthenticationResponse('', 'Request cannot be empty', ResponseStatus.failure, 400, {});
            } else {
                if (!request.email || request.email === '') {
                    valid = false;
                    returnMessage += 'Email must be supplied';
                }

                if (!request.password || request.password === '') {
                    valid = false;
                    returnMessage += '\nPassword must be supplied';
                }

                if (!request.id || request.id === '') {
                    valid = false;
                    returnMessage += '\nRequest id must be supplied  and must be a valid Bson Id';
                }
            }

            if (!valid) {
                return new AuthenticationResponse(request.id, returnMessage, ResponseStatus.failure, 400, {});
            }

            const response = new AuthenticationResponse(request.id, returnMessage, ResponseStatus.success, 200, {});
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error during request validation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
