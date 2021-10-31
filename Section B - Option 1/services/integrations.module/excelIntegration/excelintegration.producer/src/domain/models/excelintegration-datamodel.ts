import { ExportType } from "./export-type";

export class ExcelIntegrationDataModel {
    constructor(
        public exportType: ExportType,
        public emailAddress: string,
        public organizationId: string
    ) {}
}
