export class EmailDataModel {
    constructor(
        public subject: string,
        public from: string,
        public to: string[],
        public cc: string[],
        public message: string,
        public attachments: any[]
    ) { }
}