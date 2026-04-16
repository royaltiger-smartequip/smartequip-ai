# smartequip-ai

SmartEquip AI GitHub App built with Probot.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Development

```sh
# Run with auto-reload
npm run dev
```

## Configuration

1. Create a GitHub App at https://github.com/settings/apps/new
2. Copy `.env.example` to `.env`
3. Fill in your `APP_ID`, `WEBHOOK_SECRET`, and `GITHUB_PRIVATE_KEY`

## What it does

Currently responds with "Hello World" when:
- A new issue is opened
- A new pull request is opened
