import configuration from './configuration.json';
import { DBConfig } from './domain/config/db-config';
import { TokenValidationOptions } from './domain/config/token-validation-options';
import { Config } from './domain/config/config';
import { KeyRepository } from './domain/repositories/key-repository';
import { JWTAggregate } from './domain/aggregates/jwt-aggregate';
import { JWTMapping } from './domain/mapping/jwt-mapping';
import { Role } from './domain/models/user-role';

export function validateJWT(req: any, res: any, next: any, roles: Role[]) {
    try {
        /* tslint:disable:no-string-literal */
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }

            const configurationDatabase = new DBConfig(
                configuration.configurationDatabase.databaseName,
                configuration.configurationDatabase.collectionName,
                configuration.configurationDatabase.connectionString
            );

            const tokenValidationOptions = new TokenValidationOptions(
                configuration.tokenValidationOptions.issuer,
                configuration.tokenValidationOptions.subject,
                configuration.tokenValidationOptions.audience,
                configuration.tokenValidationOptions.expiresIn,
                configuration.tokenValidationOptions.algorithm
            );

            const config = new Config(configurationDatabase, tokenValidationOptions);
            const keyRepository = new KeyRepository(config);
            const mapping = new JWTMapping();
            const aggregate = new JWTAggregate(mapping, keyRepository, config);

            aggregate
                .validateTokenAsync(token)
                .then((decodedToken) => {
                    if (decodedToken) {
                        let isInRole = decodedToken.isAdminUser;

                        if (!isInRole) {
                            if (roles.length > 0) {
                                roles.forEach((element) => {
                                    if (!isInRole) {
                                        decodedToken.roles.forEach((role: Role) => {
                                            if (element.key === role.key && role.access >= element.access) {
                                                isInRole = true;
                                            }
                                        });
                                    }
                                });
                            } else {
                                isInRole = true;
                            }
                        }

                        if (isInRole) {
                            res.locals.user = decodedToken;
                            next();
                        } else {
                            return res.status(403).send({
                                success: false,
                                message: 'User does not have the valid access required to access this item',
                            });
                        }
                    } else {
                        return res.status(401).send({
                            success: false,
                            message: 'Authentication token is invalid',
                        });
                    }
                })
                .catch((ex) => {
                    return res.status(401).send({
                        success: false,
                        message: 'Authentication token is invalid',
                    });
                });
        } else {
            return res.status(401).send({
                success: false,
                message: 'Authentication token is invalid',
            });
        }
    } catch (ex) {
        return res.status(401).send({
            success: false,
            message: 'Authentication token is invalid',
        });
    }
}
