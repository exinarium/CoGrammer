export class ExcelIntegrationRequest {
    constructor(public id: string, public produceMessage: boolean, public emailAddress: string, public exportType: number) {}
}
