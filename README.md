# promptees ^0.0.1

[![npm (scoped)](https://img.shields.io/npm/v/promptees.svg)](https://www.npmjs.com/package/promptees/)
[![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/promptees.svg)](https://www.npmjs.com/package/promptees)

A small tool to make it easy to create an interactive chatbot.

## Notes

**This library is still in Beta version**

This is my first library. Maybe you'll see some stupid things here. I'm planning to improve this library soon.

<img src='./promptees.svg'>

## Install

```bash
$ npm install promptees
```

## Usage

```ts
const Prompt = require('promptees');
const _prompt = new Prompt();

// message handler
// the function must be async
async function on_message(user: string, message: string) {
	logger(user, message);

	// this is necessary to catch the user response
	// put this line before any script in your message handler
	if (_prompt.isPrompting(user, message)) return;

	bot.reply(user, `Hello! How are you, ${user}?`);

	const answer = await _prompt.waitForResponse(user);

	bot.reply(user, `${answer} too! Nice to meet you, ${user}...!`);
}

// simulate the incoming message
on_message('Bob', 'Hi bot');
on_message('Rick', 'Hello, bot!');
on_message('Rick', "I'm fine!");
on_message('Bob', 'Everything is good.');
```

```
// output
Bob => Hi bot
BOT => Hello! How are you, Bob?
Rick => Hello, bot!
BOT => Hello! How are you, Rick?
Rick => I'm fine!
Bob => Everything is good.
BOT => I'm fine! too! Nice to meet you, Rick!
BOT => Everything is good. too! Nice to meet you, Bob!
```

> See this example in action by running `npm test`
