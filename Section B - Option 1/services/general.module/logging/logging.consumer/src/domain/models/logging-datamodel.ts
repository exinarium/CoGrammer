import { LogPriority } from './log-priority';

export class LoggingDataModel {
    constructor(public message: string, public error: Error, public priority: LogPriority, public timestamp: Date) {}
}
