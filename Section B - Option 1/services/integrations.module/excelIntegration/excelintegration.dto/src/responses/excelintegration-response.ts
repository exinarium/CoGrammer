import { ResponseStatus } from './response-status';

export class ExcelIntegrationResponse {
    constructor(
        public id: string,
        public message: string,
        public status: ResponseStatus,
        public code: number,
        public data: any
    ) {}
}
