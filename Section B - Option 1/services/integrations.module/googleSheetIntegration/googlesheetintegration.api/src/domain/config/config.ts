import { GoogleConfig } from "./google-config";
export class Config {
    constructor(public googleConfig: GoogleConfig, public connectionString: string) {}
}