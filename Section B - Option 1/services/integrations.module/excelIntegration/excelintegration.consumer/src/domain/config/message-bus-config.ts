export class MessageBusConfig {
    constructor(
        public connectionString: string,
        public topic: string
    ) {}
}