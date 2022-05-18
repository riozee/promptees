export type PrompteesOpts<Input, OnTimeout> = {
	/**
	 * Timeout in milliseconds. If `returnPrompt()` is not called after the timeout has elapsed, the `waitForResponse()` will return `{timeout: true}` or the specified onTimeout return value.
	 */
	timeout?: number;
	/**
	 * Function called when the timeout has elapsed, and its return value will be returned by `waitForResponse()`.
	 */
	onTimeout?: () => OnTimeout;
	/**
	 * If it returns true, it will not resolve the promise, and call the function in `onLoop`.
	 */
	loopWhen?: (input: Input) => Promise<boolean> | boolean;
	/**
	 * Function called when `loopWhen` returns true.
	 */
	onLoop?: (input: Input) => any;
};

export default class Prompt<Input, OnTimeout = { timeout: true }> {
	private promptees: {
		[identifier: string]: {
			fn: (value: any) => void;
			loopWhen?: PrompteesOpts<Input, OnTimeout>['loopWhen'];
			onLoop?: PrompteesOpts<Input, OnTimeout>['onLoop'];
		};
	} = {};
	private timeout?: PrompteesOpts<Input, OnTimeout>['timeout'];
	private onTimeout?: PrompteesOpts<Input, OnTimeout>['onTimeout'];
	private loopWhen?: PrompteesOpts<Input, OnTimeout>['loopWhen'];
	private onLoop?: PrompteesOpts<Input, OnTimeout>['onLoop'];

	/**
	 * If you will not use timeout, you can write the same type into both generic type parameter.
	 * Like this:
	 * ```ts
	 * const promptees = new Prompt<Same, Same>();
	 * ```
	 * This will eliminate `{timeout: true}` from the return type of `waitForResponse()`.
	 */
	constructor(opts?: PrompteesOpts<Input, OnTimeout>) {
		if (opts?.timeout) this.timeout = opts.timeout;
		if (opts?.onTimeout) this.onTimeout = opts.onTimeout;
		if (opts?.loopWhen) this.loopWhen = opts.loopWhen;
		if (opts?.onLoop) this.onLoop = opts.onLoop;
	}

	/**
	 * Check if identifier is waiting for an input.
	 *
	 * @returns {boolean} True if identifier is in promptees list. Otherwise False.
	 */
	isPrompting(identifier: string): boolean {
		if (identifier in this.promptees) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Resolves `waitForResponse()` called with the same identifier.
	 *
	 * @param value The value returned by `waitForResponse()`
	 * @returns {boolean} True if identifier is in promptees list. Otherwise False.
	 */
	async returnPrompt(identifier: string, value: Input): Promise<boolean> {
		if (identifier in this.promptees) {
			if (await this.promptees[identifier]?.loopWhen?.(value)) {
				this.promptees[identifier]?.onLoop?.(value);
				return true;
			}
			this.promptees[identifier].fn(value);
			delete this.promptees[identifier];
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Prompt the user!
	 *
	 * Resolves after calling returnPrompt() with the same identifier. Returns the value passed to returnPrompt().
	 *
	 * If timeout and onTimeout are set, it will call onTimeout() and returns the value after the timeout has elapsed.
	 * Otherwise, if onTimeout is not set, it will return {timeout: true}.
	 *
	 * @resolves Value passed to `returnPrompt()` with the same identifier.
	 */
	waitForResponse<oInput = Input, oOnTimeout = OnTimeout>(identifier: string, opts?: PrompteesOpts<oInput, oOnTimeout>) {
		return new Promise<oInput | oOnTimeout>((resolve) => {
			if ((opts?.timeout ?? this.timeout) > 0) {
				const timeoutId = setTimeout(() => {
					this.promptees[identifier].fn((opts?.onTimeout ?? this.onTimeout)?.() || { timeout: true });
					delete this.promptees[identifier];
				}, this.timeout);
				this.promptees[identifier] = {
					fn: function (value) {
						clearTimeout(timeoutId);
						return resolve(value);
					},
				};
			} else {
				this.promptees[identifier] = {
					fn: function (value) {
						return resolve(value);
					},
				};
			}
			this.promptees[identifier].loopWhen = (opts?.loopWhen || this.loopWhen) as PrompteesOpts<Input, OnTimeout>['loopWhen'];
			this.promptees[identifier].onLoop = (opts?.onLoop || this.onLoop) as PrompteesOpts<Input, OnTimeout>['onLoop'];
		});
	}
}
