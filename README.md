# promptees

[![npm (scoped)](https://img.shields.io/npm/v/promptees.svg)](https://www.npmjs.com/package/promptees/)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/promptees.svg)](https://www.npmjs.com/package/promptees)

A small tool to make it easy to create an interactive chatbot.

<img src='./promptees.svg'>

## Install

```bash
$ npm install promptees
```

## Changelog

### 2.0.0

-   `returnPrompt()` is now an **async** function, to support the **loop** feature.
-   Added new feature: **loop**
-   Removed all dependencies.

### 1.0.1

-   Added `PrompteesOpts` type to exported member.
-   Typescript fixes.

### 1.0.0

-   `isPrompting()` is now splitted into two, `isPrompting()` and `returnPrompt()`. Now it's possible to check first and then do some processing before resolving to `waitForResponse()`. `returnPrompt()` is behaving the same as `isPrompting()` in the previous version. So you should rename `isPrompting()` to `returnPrompt()` if you have a working code using the previous version.
-   Typescript intellisense is now possible using generic type parameter.
-   Added new feature: **timeout**.

## Usage

```ts
// test.ts
import Prompt from 'promptees';

const promptees = new Prompt({
	timeout: 3000,
	onTimeout: () => 'timed out',
	loopWhen: (input) => input === 'roll',
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
	onMessage('Rick', 'roll');
	await pause(500);
	onMessage('Rick', 'roll');
	await pause(500);
	onMessage('Rick', 'roll');
	await pause(500);
	onMessage('Rick', 'roll');
	await pause(500);
	onMessage('Rick', '35');
})();
```

Output:

```
<Lina> Hi bot
<BOT> Hi, tell me your age.
<Lina> 14
<BOT> You are not allowed
============
<Jeff> Hello
<BOT> Hi, tell me your age.
<BOT> Are you still there?
============
<Rick> roll
<BOT> Hi, tell me your age.
<Rick> roll
<BOT> What's roll?
<Rick> roll
<BOT> What's roll?
<Rick> roll
<BOT> What's roll?
<Rick> 35
<BOT> You are allowed.
```

<center><i>See my bot project: <a href='https://github.com/riozec/miki-whatsapp-bot'>Miki Bot</a>.</i></center>
