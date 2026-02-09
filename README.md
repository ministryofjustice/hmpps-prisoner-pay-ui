# hmpps-prisoner-pay-ui

[![Ministry of Justice Repository Compliance Badge](https://github-community.service.justice.gov.uk/repository-standards/api/hmpps-prisoner-pay-ui/badge?style=flat)](https://github-community.service.justice.gov.uk/repository-standards/hmpps-prisoner-pay-ui)
[![Docker Repository on ghcr](https://img.shields.io/badge/ghcr.io-repository-2496ED.svg?logo=docker)](https://ghcr.io/ministryofjustice/hmpps-prisoner-pay-ui)

This application is the frontend client for the prisoner pay service. The client is backed by [hmpps-prisoner-pay-orchestrator](https://github.com/ministryofjustice/hmpps-prisoner-pay-orchestrator-api) and [hmpps-prisoner-pay-api](https://github.com/ministryofjustice/hmpps-prisoner-pay-api)

## Generating Open API Types

There are various services which should have their types regenerated:

```
./generate-prisoner-pay-types.sh
./generate-pay-orchestrator-types.sh
```

## Running the app via docker-compose

The easiest way to run the app is to use docker compose to create the service and all dependencies.

`docker compose pull`

`docker compose up`

### Running the app for development

To start the main services excluding the example typescript template app:

`docker compose up --scale=app=0`

Create an environment file by copying `.env.example` -> `.env`
Environment variables set in here will be available when running `start:dev`

Install dependencies using `npm install`, ensuring you are using `node v20`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder
to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json`
and the github pipeline build config.

And then, to build the assets and start the app with esbuild:

`npm run start:dev`

### Logging in with a test user

Once the application is running you should then be able to login

To request specific users and roles then raise a PR
to [update the seed data](https://github.com/ministryofjustice/hmpps-auth/blob/main/src/main/resources/db/dev/data/auth/V900_3__users.sql)
for the in-memory DB used by Auth

### Run linter

- `npm run lint` runs `eslint`.
- `npm run typecheck` runs the TypeScript compiler `tsc`.

### Run unit tests

`npm run test`

### Running integration tests

For local running, start a wiremock instance by:

`docker compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with auto-restart on changes)

After first install ensure playwright is initialised: 

`npm run int-test-init:ci`

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the UI:

`npm run int-test-ui`

## Change log

A changelog for the service is available [here](./CHANGELOG.md)
