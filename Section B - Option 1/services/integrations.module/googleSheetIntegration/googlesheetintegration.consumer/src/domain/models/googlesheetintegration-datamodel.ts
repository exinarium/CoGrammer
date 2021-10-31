export class GoogleSheetIntegrationDataModel {
    constructor(
        public sheetName: string,
        public values: string[],
        public organizationId: string
    ) { }
}