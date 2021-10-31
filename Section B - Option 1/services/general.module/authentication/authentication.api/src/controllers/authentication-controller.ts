import { AuthenticationRequest, AuthenticationResponse, ResponseStatus } from '../../../authentication.dto/src';
import { AuthenticationAggregate } from '../domain/aggregates/authentication-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';

export class AuthenticationController {
    constructor(private _aggregate: AuthenticationAggregate) { }

    async doAsync(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        try {
            const response = await this._aggregate.generateTokenAsync(request);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in Authentication producer';
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            if (ex instanceof EvalError) {
                return new AuthenticationResponse(
                    request.id,
                    ex.message,
                    ResponseStatus.failure,
                    401,
                    {}
                );
            } else {
                return new AuthenticationResponse(
                    request.id,
                    'An error occurred inside the Authentication controller and the request could not be processed',
                    ResponseStatus.failure,
                    500,
                    {}
                );
            }
        }
    }
}
