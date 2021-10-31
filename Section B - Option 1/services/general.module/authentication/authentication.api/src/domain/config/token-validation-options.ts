export class TokenValidationOptions {
    constructor(
        public issuer: string,
        public subject: string,
        public audience: string,
        public expiresIn: string,
        public algorithm: string
    ) {}
}
