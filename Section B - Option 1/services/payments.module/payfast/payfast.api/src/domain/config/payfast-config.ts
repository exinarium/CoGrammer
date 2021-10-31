export class PayfastConfig {
    constructor(
        public url: string,
        public merchantId: string,
        public merchantKey: string,
        public passphrase: string,
        public payfastMainUrl: string
    ) { }
}