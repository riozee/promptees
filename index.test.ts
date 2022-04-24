import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import Prompt from './index';

describe('Test promptees', () => {
	it('Simulate incoming messages', () => {
		const _prompt = new Prompt();
		async function on_message(user: string, message: string) {
			console.log(user, '=>', message);
			if (_prompt.isPrompting(user, message)) return;

			if (user === 'Bob') {
				expect(message).to.be.equal('Hi bot');
			} else if (user === 'Rick') {
				expect(message).to.be.equal('Hello, bot!');
			}

			console.log('BOT', '=>', `Hello! How are you, ${user}?`);
			const response = await _prompt.waitForResponse(user);
			console.log('BOT', '=>', `${response} too! Nice to meet you, ${user}!`);

			if (user === 'Bob') {
				expect(response).to.be.equal('Everything is good.');
			} else if (user === 'Rick') {
				expect(response).to.be.equal("I'm fine!");
			}
		}

		on_message('Bob', 'Hi bot');
		on_message('Rick', 'Hello, bot!');
		on_message('Rick', "I'm fine!");
		on_message('Bob', 'Everything is good.');
	});
});
