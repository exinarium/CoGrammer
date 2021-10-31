import { IAuthenticationAggregate } from './iauthentication-aggregate';
import { IAuthenticationRepository } from '../repositories/iauthentication-repository';
import { AuthenticationResponse, ResponseStatus, AuthenticationRequest } from '../../../../authentication.dto/src';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { IAuthenticationValidation } from '../validation/iauthentication-validation';
import { IAuthenticationMapping } from '../mapping/iauthentication-mapping';
import jwt from 'jsonwebtoken';
import { Algorithm, SignOptions } from 'jsonwebtoken';
import { IKeyRespository } from '../repositories/ikey-repository';
import { Config } from '../config/config';
import { User } from '../models/user';
import { AuditLogProducer } from 'covidscreener-auditlog/dist';
import { AuditLogEvent } from 'covidscreener-auditlog/dist/auditlog.dto/src';
import { ObjectID } from 'mongodb';

export class AuthenticationAggregate implements IAuthenticationAggregate {
    constructor(
        private repository: IAuthenticationRepository,
        private validation: IAuthenticationValidation,
        private mapper: IAuthenticationMapping,
        private keyRepository: IKeyRespository,
        private config: Config
    ) { }

    async generateTokenAsync(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        try {
            const validationResponse = await this.validation.validate(request);

            if (validationResponse.status === ResponseStatus.failure) {
                validationResponse.id = request.id;
                return validationResponse;
            }

            const model = await this.mapper.mapToModel(request);
            const userModel = await this.repository.authUserAsync(model);

            if (userModel) {
                const privateKEY = await this.keyRepository.getEncryptionKeyAsync('auth-private-key');

                const signOptions: SignOptions = {
                    issuer: this.config.tokenValidationOptions.issuer,
                    subject: this.config.tokenValidationOptions.subject,
                    audience: this.config.tokenValidationOptions.audience,
                    expiresIn: this.config.tokenValidationOptions.expiresIn,
                    algorithm: "RS256"
                };

                const token = jwt.sign({ data: userModel }, privateKEY, signOptions);

                const userEvent = {
                    name: userModel.name,
                    email: userModel.email,
                    organizationId: userModel.organizationId,
                    userId: userModel._id
                }

                const auditEvent: AuditLogEvent<any> = {
                    objectId: new ObjectID(),
                    eventName: 'UserLoggedInEvent',
                    version: 1,
                    data: userEvent,
                    producedAt: new Date(),
                    module: 5,
                };

                await new AuditLogProducer().produceAsync(auditEvent);

                return new AuthenticationResponse('', '', ResponseStatus.success, 200, { token, userModel });
            } else {
                const response = new AuthenticationResponse(
                    request.id,
                    'Invalid credentials',
                    ResponseStatus.failure,
                    401,
                    {}
                );

                return response;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while executing aggregation logic in Authentication API';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
