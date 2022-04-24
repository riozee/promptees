export default class Prompt {
    private promptees;
    constructor();
    isPrompting(identifier: string, value: any): boolean;
    waitForResponse(identifier: string): Promise<any>;
}
