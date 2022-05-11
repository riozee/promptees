import * as mocha from 'mocha';
import * as chai from 'chai';
const expect = chai.expect;

import Prompt from './index';

describe('Test promptees', () => {
	const prompt1 = new Prompt<string>();

	it('no timeout', async () => {
		expect(await prompt1.waitForResponse('user1')).to.be.equal('bar');
	});

	setTimeout(() => prompt1.returnPrompt('user1', 'bar'), 1000);

	const prompt2 = new Prompt<string>({
		timeout: 1000,
	});

	it('with timeout', async () => {
		expect(await prompt2.waitForResponse('user2')).to.be.deep.equal({ timeout: true });
	});

	setTimeout(() => prompt2.returnPrompt('user2', 'boo'), 3000);

	const prompt3 = new Prompt<string, string>({
		timeout: 1000,
		onTimeout: () => 'oops!',
	});

	it('with timeout and onTimeout', async () => {
		expect(await prompt3.waitForResponse('user3')).to.be.equal('oops!');
	});

	setTimeout(() => prompt3.returnPrompt('user3', 'foo'), 2000);

	const prompt4 = new Prompt<string>({
		timeout: 0,
	});

	it('override with timeout', async () => {
		expect(
			await prompt4.waitForResponse('user4', {
				timeout: 1000,
			})
		).to.be.deep.equal({ timeout: true });
	});

	setTimeout(() => prompt4.returnPrompt('user4', 'beez'), 3000);

	const prompt5 = new Prompt<string, number>({
		timeout: 0,
		onTimeout: () => 200,
	});

	it('override with timeout and onTimeout', async () => {
		expect(
			await prompt5.waitForResponse('user5', {
				timeout: 1000,
				onTimeout: () => 404,
			})
		).to.be.equal(404);
	});

	setTimeout(() => prompt5.returnPrompt('user5', 'blah'), 3000);
});
