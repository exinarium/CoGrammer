import { OrganizationAggregate } from '../domain/aggregates/organization-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { StatusCode } from '../domain/enums/status-code';
import { ResponseStatus } from '../domain/enums/response-status';
import e from 'express';

export class OrganizationController {
    constructor(private _aggregate: OrganizationAggregate) { }

    async createAsync(request: any): Promise<any> {
        try {
            const response = await this._aggregate.createAsync(request, request.requestId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing create logic in Organization API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the Organization create controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    async updateAsync(request: any, user: any): Promise<any> {
        try {
            if (this.checkRole(user)) {
                const response = await this._aggregate.updateAsync(request, user, request.requestId);
                return response;
            } else {
                return {
                    responseId: request.requestId,
                    message: 'The user does not have the correct roles to access this functionality',
                    status: ResponseStatus.failure,
                    code: StatusCode.forbidden,
                };
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing updating logic in Organization API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the Organization update controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async deleteAsync(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            if (this.checkRole(user)) {
                const response = await this._aggregate.deleteAsync(requestId, organizationId, user);
                return response;
            } else {
                return {
                    responseId: requestId,
                    message: 'The user does not have the correct roles to access this functionality',
                    status: ResponseStatus.failure,
                    code: StatusCode.forbidden,
                };
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing delete logic in Organization API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the Organization delete controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async undeleteAsync(requestId: string, organizationId: string, user: any): Promise<any> {
        try {
            if (this.checkRole(user)) {
                const response = await this._aggregate.undeleteAsync(requestId, organizationId, user);
                return response;
            } else {
                return {
                    responseId: requestId,
                    message: 'The user does not have the correct roles to access this functionality',
                    status: ResponseStatus.failure,
                    code: StatusCode.forbidden,
                };
            }
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing undelete logic in Organization API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the Organization undelete controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async lookupAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            const response = await this._aggregate.lookupAsync(id, user, requestId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing lookup logic in Organization API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the Organization lookup controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    checkRole(user: any): boolean {
        let hasRole = false;

        if (user.isAdminUser) {
            return true;
        } else {
            hasRole = false;
        }

        return hasRole;
    }
}
