import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import jwt from 'jsonwebtoken';
import { IKeyRespository } from '../repositories/ikey-repository';
import { Config } from '../config/config';
import { IJWAggregate } from './ijwt-aggregate';
import { User } from '../models/user';
import { IJWTMapping } from '../mapping/ijwt-mapping';

export class JWTAggregate implements IJWAggregate {
    constructor(private mapping: IJWTMapping, private keyRepository: IKeyRespository, private config: Config) {}

    async validateTokenAsync(token: string): Promise<User> {
        try {
            const publicKEY = await this.keyRepository.getEncryptionKeyAsync('auth-public-key');

            const verifyOptions = {
                issuer: this.config.tokenValidationOptions.issuer,
                subject: this.config.tokenValidationOptions.subject,
                audience: this.config.tokenValidationOptions.audience,
                expiresIn: this.config.tokenValidationOptions.expiresIn,
                algorithm: this.config.tokenValidationOptions.algorithm,
            };

            const validToken = jwt.verify(token, publicKEY, verifyOptions);

            if (validToken) {
                const user = await this.mapping.mapToModel(validToken);

                if (!user.isDeleted) {
                    return user;
                } else {
                    return;
                }
            } else {
                return;
            }
        } catch (ex) {
            const ERROR_MESSAGE = 'Error occurred while validating the token';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }
}
