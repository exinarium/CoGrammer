import { CandidateInteractionAggregate } from '../domain/aggregates/candidateinteraction-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { StatusCode } from '../domain/enums/status-code';
import { ResponseStatus } from '../domain/enums/response-status';

export class CandidateInteractionController {
    constructor(private _aggregate: CandidateInteractionAggregate) { }

    // tslint:disable-next-line: no-shadowed-variable
    async createAsync(request: any, user: any): Promise<any> {
        try {
            const response = await this._aggregate.createAsync(request, user, request.requestId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing creation logic in CandidateInteraction API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the CandidateInteraction create controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    async updateAsync(request: any, user: any): Promise<any> {
        try {
            const response = await this._aggregate.updateAsync(request, user, request.requestId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing updating logic in CandidateInteraction API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the CandidateInteraction update controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async deleteAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            if (this.checkRole(user)) {
                const response = await this._aggregate.deleteAsync(id, user, requestId);
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
            const ERROR_MESSAGE = `Error occurred while executing delete logic in CandidateInteraction API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the CandidateInteraction delete controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async undeleteAsync(id: string, user: any, requestId: string): Promise<any> {
        try {
            const response = await this._aggregate.undeleteAsync(id, user, requestId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing undelete logic in CandidateInteraction API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the CandidateInteraction undelete controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    async lookupAsync(
        id: string,
        searchString: string,
        start: number,
        limit: number,
        user: any,
        requestId: string,
        isAdmin: boolean,
        candidateProfileId: string
    ): Promise<any> {
        try {
            const response = await this._aggregate.lookupAsync(id, searchString, start, limit, user, requestId, isAdmin, candidateProfileId);
            return response;
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing lookup logic in CandidateInteraction API: Request Id: ${requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: requestId,
                message: `An error occurred inside the CandidateInteraction lookup controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    checkRole(user: any): boolean {
        let hasRole = false;

        if (user.isAdminUser) {
            hasRole = true;
        } else {
            hasRole = false;
        }

        return hasRole;
    }
}
