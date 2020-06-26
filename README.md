# d2l-awards

[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/awards-ui-lit?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/Brightspace/awards-ui-lit.svg?branch=master)](https://travis-ci.com/Brightspace/awards-ui-lit)

UI for New Awards Experience.

This project was started during an inspiration sprint. Due to the short amount of time to work on this it is not completed yet
and still has some aspects it could be improved on.

| Implemented    | Backlog               |
|----------------|-----------------------|
| Classlist      | Backend               |
| Course Awards  | Accessibility         |
| My Awards      | Tests                 |
| Icon Library   | Certificate templates |
| GET awards API | Available awards      |

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

### Visual Diff Testing

NOTE: Visual Diff Testing implementation on hold

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag.
