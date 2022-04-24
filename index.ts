export default class Prompt {
	private promptees: { [identifier: string]: (value: any) => void } = {};

	constructor() {}

	isPrompting(identifier: string, value: any): boolean {
		if (identifier in this.promptees) {
			this.promptees[identifier](value);
			delete this.promptees[identifier];
			return true;
		} else {
			return false;
		}
	}

	waitForResponse(identifier: string) {
		return new Promise<any>((resolve) => {
			this.promptees[identifier] = function (value) {
				return resolve(value);
			};
		});
	}
}
