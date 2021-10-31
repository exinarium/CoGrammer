import { ObjectId } from 'mongodb';

export class MetadataModel {
    constructor(
        private _requestTimestamp: string,
        private _requestBody: any,
        private _responseTimestamp: string,
        private _responseBody: any,
        private _responseStatusCode: number,
        private _httpMethod: string,
        private _requestDuration: number,
        private _id?: ObjectId
    ) {}

    set id(value: ObjectId) {
        this._id = value;
    }

    get id(): ObjectId {
        return this._id;
    }

    set requestTimestamp(value: string) {
        this._requestTimestamp = value;
    }

    get requestTimestamp(): string {
        return this._requestTimestamp;
    }

    set requestBody(value: any) {
        this._requestBody = value;
    }

    get requestBody(): any {
        return this._requestBody;
    }

    set responseTimestamp(value: string) {
        this._responseTimestamp = value;
    }

    get responseTimestamp(): string {
        return this._responseTimestamp;
    }

    set responseBody(value: any) {
        this._responseBody = value;
    }

    get responseBody(): any {
        return this._responseBody;
    }

    set responseStatusCode(value: number) {
        this._responseStatusCode = value;
    }

    get responseStatusCode(): number {
        return this._responseStatusCode;
    }

    set requestDuration(value: number) {
        this._requestDuration = value;
    }

    get requestDuration(): number {
        return this._requestDuration;
    }

    set httpMethod(value: string) {
        this._httpMethod = value;
    }

    get httpMehod(): string {
        return this._httpMethod;
    }
}
