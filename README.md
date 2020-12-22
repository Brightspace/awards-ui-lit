# d2l-awards

[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/awards-ui-lit?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/Brightspace/awards-ui-lit.svg?branch=master)](https://travis-ci.com/Brightspace/awards-ui-lit)

UI for New Awards Experience.

This project was started during an inspiration sprint. Due to the short amount of time to work on this it is not completed yet
and still has some aspects that can be improved on. One of the key goals of this project is to rework the Awards experience so
that it is more consistent with modern D2L BSI apps. This UI consists of web components created using LitElement built off of
components that exist in the Brightspace UI core repo.

| Implemented    | Backlog               |
|----------------|-----------------------|
| Classlist      | Backend               |
| Course Awards  | Accessibility         |
| My Awards      | Tests                 |
| Icon Library   | Certificate templates |
| GET awards API | Available awards      |
|                | Refactoring           |
|                | Release conditions    |
|                | Classlist award icons |

A Trello board was created for the inspiration sprint. It contains some tasks that could not be completed during the first sprint.

The board can be found [here](https://trello.com/b/khMwQFxS/awardsv2).

Some additional information can be found [here](./docs/README.md)

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag.


## BEM class name best practises

The BEM guide can be found [here](http://getbem.com/introduction/)

### Example
```js
render_library = () =>
	<div class="library">
		<div class="library__shelf">
			<div class="library__book"></div>
			<div class="library__book--hard-cover"></div>
		</div>
		<div class="library__shelf--fiction">
			<div class="library__book"></div>
		</div>
	</div>
```

### Q: When to use a block?
A: A block is the top level element in the render function. If you feel you need to include a second block you may, but don't have too, create a seperate function that returns that block.

### Example
```js
render = () =>
	<div class="city">
		<div class="city__electrical-wires"/>
		<div class="city__buildings"/>
			{{ render_library() }}
		</div>
	</div>
```

### Q: What about reusable classes?
A: We use [chainable classes](https://webuild.envato.com/blog/chainable-bem-modifiers/) when basic modifiers can be applied to multiple, or a combination of, elements and blocks.
