import guid, { isGuid } from 'guid';

export class LoggingRequest {
    constructor(public id: string, public message: string, public error: Error, public priority: number) {}
}
