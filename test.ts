import Prompt from './index';

const promptees = new Prompt({
	timeout: 3000,
	onTimeout: () => 'timed out',
	loopWhen: (input) => input === 'foo',
	onLoop: (input) => console.log('<BOT>', `What's ${input}?`),
});

async function onMessage(user: string, message: string) {
	console.log(`<${user}>`, message);
	if (promptees.isPrompting(user)) {
		return await promptees.returnPrompt(user, message);
	}
	console.log('<BOT>', 'Hi, tell me your age.');
	const age = await promptees.waitForResponse(user);
	if (age === 'timed out') {
		console.log('<BOT>', 'Are you still there?');
	} else if (+age < 18) {
		console.log('<BOT>', 'You are not allowed');
	} else {
		console.log('<BOT>', 'You are allowed.');
	}
}

(async () => {
	onMessage('Lina', 'Hi bot');
	await pause(500);
	onMessage('Lina', '14');
	await pause(500);
	console.log('============');
	onMessage('Jeff', 'Hello');
	await pause(5000);
	console.log('============');
	onMessage('Rick', 'foo');
	await pause(500);
	onMessage('Rick', 'foo');
	await pause(500);
	onMessage('Rick', 'foo');
	await pause(500);
	onMessage('Rick', 'foo');
	await pause(500);
	onMessage('Rick', '35');
})();

function pause(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
