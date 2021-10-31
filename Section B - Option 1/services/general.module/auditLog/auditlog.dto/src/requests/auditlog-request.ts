export class AuditLogRequest {
    constructor(
        public id: string,
        public objectid: string,
        public producedAt: Date,
        public eventName: string,
        public data: any,
        public version: number,
        public module: number
    ) {}
}
