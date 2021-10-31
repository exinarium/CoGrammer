export class EmailRequest {
    constructor(
        public id: string,
        public name: string,
        public subject: string,
        public from: string,
        public message: string,
        public recaptchaKey: string
        ) {}
}
