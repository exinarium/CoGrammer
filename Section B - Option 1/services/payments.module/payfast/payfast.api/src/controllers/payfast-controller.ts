import { PayfastAggregate } from '../domain/aggregates/payfast-aggregate';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { StatusCode } from '../domain/enums/status-code';
import { ResponseStatus } from '../domain/enums/response-status';

export class PayfastController {
    constructor(private _aggregate: PayfastAggregate) { }

    // tslint:disable-next-line: no-shadowed-variable
    async cancelAsync(request: any, user: any): Promise<any> {
        try {
            if (this.checkRole(user, 1)) {
                const response = await this._aggregate.cancelAsync(request, user, request.requestId);
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
            const ERROR_MESSAGE = `Error occurred while executing cancellation logic in Payfast API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the Payfast cancel controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    async updateAsync(request: any, user: any): Promise<any> {
        try {
            if (this.checkRole(user, 1)) {
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
            const ERROR_MESSAGE = `Error occurred while executing updating logic in Payfast API: Request Id: ${request.requestId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the Payfast update controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    async payfastNotificationAsync(request: any): Promise<any> {

        const organizationId = request?.custom_str1;
        const paymentPlan = request?.custom_int1;
        const paymentDate = new Date();
        const paymentStatus = request.payment_status === 'COMPLETE';
        const subscriptionToken = request.token;

        try {

            if (!organizationId || organizationId === '' || !paymentPlan || paymentPlan < 0) {

                return {
                    responseId: request.requestId,
                    message: 'Invalid request object',
                    status: ResponseStatus.failure,
                    code: StatusCode.badRequest,
                }
            }

            const response = await this._aggregate.updateByNotificationAsync(organizationId, paymentPlan, paymentDate, paymentStatus, subscriptionToken);

            return {
                responseId: request.requestId,
                message: 'The user does not have the correct roles to access this functionality',
                status: ResponseStatus.failure,
                code: StatusCode.forbidden,
            };
        } catch (ex) {
            const ERROR_MESSAGE = `Error occurred while executing updating by notification logic in Payfast API: Organization Id: ${organizationId}`;
            await LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            return {
                responseId: request.requestId,
                message: `An error occurred inside the Payfast update controller and the request could not be processed: ${ex.message}`,
                status: ResponseStatus.failure,
                code: StatusCode.internalServerError,
            };
        }
    }

    checkRole(user: any, accessLevel: number): boolean {
        let hasRole = false;

        if (user.isAdminUser) {
            hasRole = true;
        } else {
            user.roles.forEach((element: any) => {
                if (element?.value?.toUpperCase() === 'Payfast'.toUpperCase()) {
                    hasRole = element.access >= accessLevel;
                }
            });
        }

        return hasRole;
    }
}
