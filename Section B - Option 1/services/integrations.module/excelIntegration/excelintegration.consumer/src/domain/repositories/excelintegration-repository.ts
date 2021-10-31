import mongodb, { MongoClient, ObjectID } from 'mongodb';
import { ExcelIntegrationDataModel } from '../models/excelintegration-datamodel';
import { ExcelIntegrationMessage } from '../../../../excelintegration.dto/src';
import { Config } from '../config/config';
import { LoggingProducer, LogPriority } from 'covidscreener-logging/dist/logging.producer/src/';
import { ExportType } from '../models/export-type';
import { Workbook } from 'exceljs';
import { DateTimeFormatter } from '../utilities/datetime-formatter';

export class ExcelIntegrationRepository {
    private config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async doAsync(message: ExcelIntegrationMessage<ExcelIntegrationDataModel>): Promise<Workbook> {
        let result;

        try {
            if (message?.data?.exportType === ExportType.exportData) {

                return Promise.all([
                    this.getData('userDataDatabase', {
                        name: 1,
                        email: 1,
                        isAdminUser: 1,
                        isDeleted: 1
                    },
                        false,
                        message.data.organizationId),
                    this.getData('candidateProfileDatabase', {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        idNumber: 1,
                        telephoneNumber: 1,
                        emailAddress: 1,
                        physicalAddress: 1,
                        marketingConsent: 1,
                        modifiedDate: 1,
                        username: 1,
                        isDeleted: 1
                    },
                        false,
                        message.data.organizationId),
                    this.getData('candidateInteractionDatabase', {
                        profileId: 1,
                        meetingAddress: 1,
                        clientClassification: 1,
                        temperature: 1,
                        suspectedCovid19: 1,
                        symptomsCovid19: 1,
                        directContactCovid19: 1,
                        indirectContactCovid19: 1,
                        testedCovid19: 1,
                        travelledProvincially: 1,
                        travelledInternationally: 1,
                        autoImmuneDisease: 1,
                        additionalNotes: 1,
                        modifiedDate: 1,
                        username: 1,
                        IsDeleted: 1,
                    },
                        false,
                        message.data.organizationId)
                ]).then(data => {

                    if (data) {
                        result = this.createExcelWorkbookData(data[0], data[1], data[2]);
                        return result;
                    }
                });
            } else if (message?.data?.exportType === ExportType.exportAuditTrail) {

                return Promise.all([
                    this.getData('userAuditDatabase', {
                        'data.name': 1,
                        'data.email': 1,
                        'data.isAdminUser': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('logInAuditDatabase', {
                        'data.name': 1,
                        'data.email': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('candidateProfileAuditDatabase', {
                        'data._id': 1,
                        'data.firstName': 1,
                        'data.lastName': 1,
                        'data.idNumber': 1,
                        'data.telephoneNumber': 1,
                        'data.emailAddress': 1,
                        'data.physicalAddress': 1,
                        'data.marketingConsent': 1,
                        'data.modifiedDate': 1,
                        'data.username': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('candidateInteractionAuditDatabase', {
                        'data.profileId': 1,
                        'data.meetingAddress': 1,
                        'data.clientClassification': 1,
                        'data.temperature': 1,
                        'data.suspectedCovid19': 1,
                        'data.symptomsCovid19': 1,
                        'data.directContactCovid19': 1,
                        'data.indirectContactCovid19': 1,
                        'data.testedCovid19': 1,
                        'data.travelledProvincially': 1,
                        'data.travelledInternationally': 1,
                        'data.autoImmuneDisease': 1,
                        'data.additionalNotes': 1,
                        'data.modifiedDate': 1,
                        'data.username': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId)
                ]).then(data => {
                    if (data) {
                        result = this.createExcelWorkbookAuditData(data[0], data[1], data[2], data[3]);
                        return result;
                    }
                });
            } else if (message.data.exportType === ExportType.exportAll) {

                return Promise.all([
                    this.getData('userDataDatabase', {
                        name: 1,
                        email: 1,
                        isAdminUser: 1,
                        isDeleted: 1
                    },
                        false,
                        message.data.organizationId),
                    this.getData('candidateProfileDatabase', {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        idNumber: 1,
                        telephoneNumber: 1,
                        emailAddress: 1,
                        physicalAddress: 1,
                        marketingConsent: 1,
                        modifiedDate: 1,
                        username: 1,
                        isDeleted: 1
                    },
                        false,
                        message.data.organizationId),
                    this.getData('candidateInteractionDatabase', {
                        profileId: 1,
                        meetingAddress: 1,
                        clientClassification: 1,
                        temperature: 1,
                        suspectedCovid19: 1,
                        symptomsCovid19: 1,
                        directContactCovid19: 1,
                        indirectContactCovid19: 1,
                        testedCovid19: 1,
                        travelledProvincially: 1,
                        travelledInternationally: 1,
                        autoImmuneDisease: 1,
                        additionalNotes: 1,
                        modifiedDate: 1,
                        username: 1,
                        IsDeleted: 1,
                    },
                        false,
                        message.data.organizationId),
                    this.getData('userAuditDatabase', {
                        'data.name': 1,
                        'data.email': 1,
                        'data.isAdminUser': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('logInAuditDatabase', {
                        'data.name': 1,
                        'data.email': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('candidateProfileAuditDatabase', {
                        'data._id': 1,
                        'data.firstName': 1,
                        'data.lastName': 1,
                        'data.idNumber': 1,
                        'data.telephoneNumber': 1,
                        'data.emailAddress': 1,
                        'data.physicalAddress': 1,
                        'data.marketingConsent': 1,
                        'data.modifiedDate': 1,
                        'data.username': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId),
                    this.getData('candidateInteractionAuditDatabase', {
                        'data.profileId': 1,
                        'data.meetingAddress': 1,
                        'data.clientClassification': 1,
                        'data.temperature': 1,
                        'data.suspectedCovid19': 1,
                        'data.symptomsCovid19': 1,
                        'data.directContactCovid19': 1,
                        'data.indirectContactCovid19': 1,
                        'data.testedCovid19': 1,
                        'data.travelledProvincially': 1,
                        'data.travelledInternationally': 1,
                        'data.autoImmuneDisease': 1,
                        'data.additionalNotes': 1,
                        'data.modifiedDate': 1,
                        'data.username': 1,
                        'data.isDeleted': 1,
                        'data.version': 1,
                        'producedAt': 1,
                        'eventName': 1
                    },
                        true,
                        message.data.organizationId)
                ]).then(data => {
                    const dataWorkbook = this.createExcelWorkbookData(data[0], data[1], data[2]);
                    result = this.createExcelWorkbookAuditData(data[3], data[4], data[5], data[6], dataWorkbook);
                    return result;
                });
            }
        } catch (ex) {

            const ERROR_MESSAGE = 'Error in ExcelIntegration while doing a database operation';
            LoggingProducer.logAsync(ERROR_MESSAGE, ex, LogPriority.high);

            throw ex;
        }
    }

    async getData(databaseDescription: string, projection: any, event: boolean, organizationId: string): Promise<any[]> {
        let result: any[] = [];
        let dataContext;

        try {

            const config = this.config.databaseConfig.find(element => {
                return element.databaseDescription === databaseDescription;
            });

            if (config) {
                const connectionString = config.connectionString;

                if (connectionString === undefined || connectionString === '') {
                    throw new Error('Connection string cannot be null or empty');
                }

                dataContext = await new mongodb.MongoClient(connectionString, { useUnifiedTopology: true }).connect();

                const collection = dataContext
                    .db(config.databaseName)
                    .collection(config.collectionName);

                if (event) {
                    result = await collection.find({ 'data.organizationId': organizationId }).project(projection).toArray();
                } else {
                    result = await collection.find({ 'organizationId': new ObjectID(organizationId) }).project(projection).toArray();
                }
            }
        }
        catch (err) {
            throw err;
        }
        finally {
            dataContext.close();
        }

        return result;
    }

    async createExcelWorkbookData(userData: any[], candidateProfileData: any[], candidateInteractionData: any[]): Promise<Workbook> {

        const workbook = new Workbook();

        workbook.creator = 'Creativ360';
        workbook.lastModifiedBy = 'Creativ360';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.properties.date1904 = true;

        workbook.views = [
            {
                x: 0, y: 0, width: 10000, height: 20000,
                firstSheet: 0, activeTab: 0, visibility: 'visible'
            }
        ];

        const sheetUsers = workbook.addWorksheet('Users');
        const sheetContacts = workbook.addWorksheet('Contacts');
        const sheetInteractions = workbook.addWorksheet('Interactions');

        // Add User Data
        sheetUsers.columns = [
            { header: 'Name', key: 'name', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Email', key: 'email', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Admin User', key: 'adminUser', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'deleted', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetUsers.autoFilter = 'A1:D1';
        sheetUsers.getRow(1).font = {bold: true};

        let count = 2;
        userData.forEach(element => {
            sheetUsers.insertRow(count, {
                name: element.name,
                email: element.email,
                adminUser: element.isAdminUser === true ? 'Yes' : 'No',
                deleted: element.isDeleted === true ? 'Yes' : 'No'
            });
            count++;
        });

        // Add Contact Data
        sheetContacts.columns = [
            { header: 'Profile ID', key: 'profileId', width: 30, style: { font: { 'size': 12 } } },
            { header: 'First Name', key: 'firstName', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Last Name', key: 'lastName', width: 30, style: { font: { 'size': 12 } } },
            { header: 'ID Number', key: 'idNumber', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Telephone Number', key: 'telNumber', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Email Address', key: 'emailAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Physical Address', key: 'physicalAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Marketing Consent', key: 'marketingConsent', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified Date', key: 'modifiedDate', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified By', key: 'modifiedBy', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'isDeleted', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetContacts.autoFilter = 'A1:K1';
        sheetContacts.getRow(1).font = {bold: true};

        count = 2;
        candidateProfileData.forEach(element => {
            sheetContacts.insertRow(count, {
                profileId: new ObjectID(element._id)?.toHexString(),
                firstName: element.firstName,
                lastName: element.lastName,
                idNumber: element.idNumber,
                telNumber: element.telephoneNumber,
                emailAddress: element.emailAddress,
                physicalAddress: element.physicalAddress,
                marketingConsent: element.marketingConsent === true ? 'Yes' : 'No',
                modifiedDate: element.modifiedDate ? DateTimeFormatter.formatDateTime(new Date(element.modifiedDate)) : '',
                modifiedBy: element.username,
                isDeleted: element.isDeleted === true ? 'Yes' : 'No'
            });

            count++;
        });

        // Add Interaction Data
        sheetInteractions.columns = [
            { header: 'Profile ID', key: 'profileId', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Meeting Address', key: 'meetingAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Classification', key: 'contactClassification', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Temperature', key: 'temperature', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Suspected', key: 'suspected', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Symptoms', key: 'symptoms', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Direct Contact', key: 'directContact', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Indirect Contact', key: 'indirectContact', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Tested', key: 'tested', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Travelled Provinically', key: 'travelledProvincially', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Travelled Internationally', key: 'travelledInternationally', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Auto Immune Disease', key: 'autoImmuneDisease', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Notes', key: 'additionalNotes', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified Date', key: 'modifiedDate', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified By', key: 'username', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'isDeleted', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetInteractions.autoFilter = 'A1:P1';
        sheetInteractions.getRow(1).font = {bold: true};

        count = 2;
        candidateInteractionData.forEach(element => {
            sheetInteractions.insertRow(count, {
                profileId: new ObjectID(element.profileId)?.toHexString(),
                meetingAddress: element.meetingAddress,
                contactClassification: element.clientClassification,
                temperature: element.temperature,
                suspected: element.suspectedCovid19 === 'Yes' ? 'Yes' : 'No',
                symptoms: element.symptomsCovid19 === 'Yes' ? 'Yes' : 'No',
                directContact: element.directContactCovid19 === 'Yes' ? 'Yes' : 'No',
                indirectContact: element.indirectContactCovid19 === 'Yes' ? 'Yes' : 'No',
                tested: element.testedCovid19 === 'Yes' ? 'Yes' : 'No',
                travelledProvincially: element.travelledProvincially === 'Yes' ? 'Yes' : 'No',
                travelledInternationally: element.travelledInternationally === 'Yes' ? 'Yes' : 'No',
                autoImmuneDisease: element.autoImmuneDisease === 'Yes' ? 'Yes' : 'No',
                additionalNotes: element.additionalNotes,
                modifiedDate: element.modifiedDate ? DateTimeFormatter.formatDateTime(new Date(element.modifiedDate)) : '',
                username: element.username,
                isDeleted: element.isDeleted === true ? 'Yes' : 'No',
            });

            count++;
        });

        return workbook;
    }

    async createExcelWorkbookAuditData(userAuditData: any[], logInAuditData: any[], candidateProfileAuditData: any[], candidateInteractionAuditData: any[], workBook?: Promise<Workbook>): Promise<Workbook> {

        let workbook;
        if (!workBook) {

            workbook = new Workbook();

            workbook.creator = 'Creativ360';
            workbook.lastModifiedBy = 'Creativ360';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.properties.date1904 = true;

            workbook.views = [
                {
                    x: 0, y: 0, width: 10000, height: 20000,
                    firstSheet: 0, activeTab: 0, visibility: 'visible'
                }
            ];
        } else {

            workbook = await workBook;
        }

        const sheetUserAudit = workbook.addWorksheet('UserAudit');
        const sheetLogInAudit = workbook.addWorksheet('LogInAudit');
        const sheetContactAudit = workbook.addWorksheet('ContactAudit');
        const sheetInteractionAudit = workbook.addWorksheet('InteractionAudit');

        // Add User Audit Data
        sheetUserAudit.columns = [
            { header: 'Name', key: 'name', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Email', key: 'email', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Admin User', key: 'adminUser', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'deleted', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Version', key: 'version', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Produced At', key: 'producedAt', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Event Name', key: 'eventName', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetUserAudit.getRow(1).font = {bold: true};
        sheetUserAudit.autoFilter = 'A1:G1';

        let count = 2;
        userAuditData.forEach(element => {
            sheetUserAudit.insertRow(count, {
                name: element?.data?.name,
                email: element?.data?.email,
                adminUser: element?.data?.isAdminUser === true ? 'Yes' : 'No',
                deleted: element?.data?.isDeleted === true ? 'Yes' : 'No',
                version: element?.data?.version,
                producedAt: element.producedAt ? DateTimeFormatter.formatDateTime(new Date(element.producedAt)) : '',
                eventName: element.eventName
            });
            count++;
        });

        // Add User Login Audit Data
        sheetLogInAudit.columns = [
            { header: 'Name', key: 'name', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Email', key: 'email', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Produced At', key: 'producedAt', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Event Name', key: 'eventName', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetLogInAudit.getRow(1).font = {bold: true};
        sheetLogInAudit.autoFilter = 'A1:D1';

        count = 2;
        logInAuditData.forEach(element => {
            sheetLogInAudit.insertRow(count, {
                name: element?.data?.name,
                email: element?.data?.email,
                producedAt: element.producedAt,
                eventName: element.eventName
            });
            count++;
        });

        // Add Contact Audit Data
        sheetContactAudit.columns = [
            { header: 'Profile ID', key: 'profileId', width: 30, style: { font: { 'size': 12 } } },
            { header: 'First Name', key: 'firstName', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Last Name', key: 'lastName', width: 30, style: { font: { 'size': 12 } } },
            { header: 'ID Number', key: 'idNumber', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Telephone Number', key: 'telNumber', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Email Address', key: 'emailAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Physical Address', key: 'physicalAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Marketing Consent', key: 'marketingConsent', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified Date', key: 'modifiedDate', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified By', key: 'modifiedBy', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'isDeleted', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Version', key: 'version', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Produced At', key: 'producedAt', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Event Name', key: 'eventName', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetContactAudit.getRow(1).font = {bold: true};
        sheetContactAudit.autoFilter = 'A1:N1';

        count = 2;
        candidateProfileAuditData.forEach(element => {
            sheetContactAudit.insertRow(count, {
                profileId: new ObjectID(element?.data?._id)?.toHexString(),
                firstName: element?.data?.firstName,
                lastName: element?.data?.lastName,
                idNumber: element?.data?.idNumber,
                telNumber: element?.data?.telephoneNumber,
                emailAddress: element?.data?.emailAddress,
                physicalAddress: element?.data?.physicalAddress,
                marketingConsent: element?.data?.marketingConsent === true ? 'Yes' : 'No',
                modifiedDate: element?.data?.modifiedDate ? DateTimeFormatter.formatDateTime(new Date(element.data.modifiedDate)) : '',
                modifiedBy: element?.data?.username,
                isDeleted: element?.data?.isDeleted === true ? 'Yes' : 'No',
                version: element?.data?.version,
                producedAt: element.producedAt ? DateTimeFormatter.formatDateTime(new Date(element.producedAt)) : '',
                eventName: element.eventName
            });

            count++;
        });

        // Add Interaction Audit Data
        sheetInteractionAudit.columns = [
            { header: 'Profile ID', key: 'profileId', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Meeting Address', key: 'meetingAddress', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Classification', key: 'contactClassification', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Temperature', key: 'temperature', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Suspected', key: 'suspected', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Symptoms', key: 'symptoms', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Direct Contact', key: 'directContact', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Indirect Contact', key: 'indirectContact', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Tested', key: 'tested', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Travelled Provinically', key: 'travelledProvincially', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Travelled Internationally', key: 'travelledInternationally', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Auto Immune Disease', key: 'autoImmuneDisease', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Notes', key: 'additionalNotes', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified Date', key: 'modifiedDate', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Modified By', key: 'username', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Deleted', key: 'isDeleted', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Version', key: 'version', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Produced At', key: 'producedAt', width: 30, style: { font: { 'size': 12 } } },
            { header: 'Event Name', key: 'eventName', width: 30, style: { font: { 'size': 12 } } },
        ];

        sheetInteractionAudit.getRow(1).font = {bold: true};
        sheetInteractionAudit.autoFilter = 'A1:S1';

        count = 2;
        candidateInteractionAuditData.forEach(element => {
            sheetInteractionAudit.insertRow(count, {
                profileId: new ObjectID(element?.data?.profileId)?.toHexString(),
                meetingAddress: element?.data?.meetingAddress,
                contactClassification: element?.data?.clientClassification,
                temperature: element?.data?.temperature,
                suspected: element?.data?.suspectedCovid19 === 'Yes' ? 'Yes' : 'No',
                symptoms: element?.data?.symptomsCovid19 === 'Yes' ? 'Yes' : 'No',
                directContact: element?.data?.directContactCovid19 === 'Yes' ? 'Yes' : 'No',
                indirectContact: element?.data?.indirectContactCovid19 === 'Yes' ? 'Yes' : 'No',
                tested: element?.data?.testedCovid19 === 'Yes' ? 'Yes' : 'No',
                travelledProvincially: element?.data?.travelledProvincially === 'Yes' ? 'Yes' : 'No',
                travelledInternationally: element?.data?.travelledInternationally === 'Yes' ? 'Yes' : 'No',
                autoImmuneDisease: element?.data?.autoImmuneDisease === 'Yes' ? 'Yes' : 'No',
                additionalNotes: element?.data?.additionalNotes,
                modifiedDate: element?.data?.modifiedDate ? DateTimeFormatter.formatDateTime(new Date(element.data.modifiedDate)) : '',
                username: element?.data?.username,
                isDeleted: element?.data?.isDeleted === 'Yes' ? 'Yes' : 'No',
                version: element?.data?.version,
                producedAt: element.producedAt ? DateTimeFormatter.formatDateTime(new Date(element.producedAt)) : '',
                eventName: element.eventName
            });

            count++;
        });

        return workbook;
    }
}
