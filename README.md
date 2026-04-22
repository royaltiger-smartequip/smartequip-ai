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

### 1. Set up Smee.io for local webhook forwarding

Visit https://smee.io and click "Start a new channel". Copy the URL.

### 2. Create a GitHub App

Go to https://github.com/settings/apps/new and configure:

**Basic Info:**
- GitHub App name: `smartequip-ai-test`
- Homepage URL: `https://github.com/royaltiger-smartequip/smartequip-ai`

**Webhook:**
- Active: ✓
- Webhook URL: Your Smee.io URL from step 1
- Webhook secret: `development` (or generate a random string)

**Permissions:**
- Repository permissions → Issues: Read & write
- Repository permissions → Pull requests: Read & write

**Subscribe to events:**
- ✓ Issues
- ✓ Pull request

**OAuth settings:**
- Leave Callback URL blank (not needed for this app)
- Don't check OAuth options

**Installation:**
- Select "Only on this account" (for testing)

### 3. After creating the app

1. Note your **App ID** from the app settings page
2. Click **Generate a private key** and download the `.pem` file
3. Install the app on your test repository

### 4. Configure environment

Run the setup script:
```sh
./setup-env.sh
```

Or manually create `.env`:
```sh
cp .env.example .env
# Edit .env with your App ID, webhook secret, and private key
```

### 5. Run the app

**Option A: Run both together (recommended)**
```sh
./dev.sh
```

**Option B: Run separately**
```sh
# Terminal 1: Forward webhooks from Smee to localhost
./start-smee.sh

# Terminal 2: Start the app
./start-app.sh
```

## What it does

Currently responds with "Hello World" when:
- A new issue is opened
- A new pull request is opened
