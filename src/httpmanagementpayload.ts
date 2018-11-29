export class HttpManagementPayload {
    constructor(
        public id: string,
        public statusQueryGetUri: string,
        public sendEventPostUri: string,
        public terminatePostUri: string,
        public rewindPostUri: string,
    ) { }
}