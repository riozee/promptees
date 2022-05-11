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

### 1.0.1

-   Added `PrompteesOpts` type to exported member.
-   Typescript fixes.

### 1.0.0

-   `isPrompting()` is now splitted into two, `isPrompting()` and `returnPrompt()`. Now it's possible to check first and then do some processing before resolving to `waitForResponse()`. `returnPrompt()` is behaving the same as `isPrompting()` in the previous version. So you should rename `isPrompting()` to `returnPrompt()` if you have a working code using the previous version.
-   Typescript intellisense is now possible using generic type parameter.
-   Added new feature: timeout.

## Usage

```ts
import Prompt, { PrompteesOpts } from 'promptees';

const _prompt = new Prompt<string, { foo: string }>({
	timeout: 5000,
	onTimeout: () => ({ foo: 'oops!' }),
});

// message handler
async function on_message(user: string, message: string) {
	logger(user, message);

	// this is necessary to catch the user response
	// put this line before any script in your message handler
	if (_prompt.isPrompting(user)) {
		return _prompt.returnPrompt(user, message);
	}

	bot.reply(user, `Tell me your age.`);

	const answer = await _prompt.waitForResponse(user);

	if ('foo' in answer && answer.foo === 'oops!') {
		bot.reply(user, `Yo, are you still there?`);
	} else if (+answer >= 18) {
		bot.reply(user, `You are allowed.`);
	} else if (+answer < 18) {
		bot.reply(user, `Do not enter.`);
	}
}

// simulate the incoming message
on_message('Bob', 'Hi bot');
on_message('Bob', '17');

on_message('Rick', 'Yo');
on_message('Rick', '23');

on_message('Jeff', '...');
```

Output:

```yaml
Bob: Hi bot
BOT: Tell me your age.
Bob: 17
BOT: Do not enter.
Rick: Yo
BOT: Tell me your age.
Rick: 23
BOT: You are allowed.
Jeff: ...
BOT: Tell me your age.
BOT: Yo, are you still there?
```

<center><i>See my bot project: <a href='https://github.com/riozec/miki-whatsapp-bot'>Miki Bot</a>.</i></center>
