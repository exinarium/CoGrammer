
import { EmailConfig } from './email-config';

export class Config {
    constructor(public topic: string, public connectionString: string, public emailConfig: EmailConfig) {}
}
