# Model Context Protocol (MCP) Integration Guide

This guide provides a comprehensive, step-by-step workflow to integrate and test five MCP (Model Context Protocol) servers in this Demo project:
1. **Figma** (Design & UI Analysis)
2. **Firecrawl** (Web Scraper to Markdown)
3. **GitHub (The Manager)** (Codebase, Issues, and PR Management)
4. **Sentry** (Error Logging & Exception Insights)
5. **Playwright** (E2E Browser Testing & Interaction)

By integrating these servers, your AI assistant (e.g., Claude Desktop, Cursor, or Claude Code) gains direct access to your designs, web scraping, git repository state, error monitoring, and browser execution.

---

## Table of Contents
- [What is Model Context Protocol (MCP)?](#what-is-model-context-protocol-mcp)
- [Claude Desktop Configuration](#claude-desktop-configuration)
- [1. Figma MCP Server](#1-figma-mcp-server)
- [2. Firecrawl MCP Server](#2-firecrawl-mcp-server)
- [3. GitHub (The Manager) MCP Server](#3-github-the-manager-mcp-server)
- [4. Sentry MCP Server](#4-sentry-mcp-server)
- [5. Playwright MCP Server](#5-playwright-mcp-server)
- [Testing Scenarios](#testing-scenarios)
  - [Automated Playwright Test Scenario](#automated-playwright-test-scenario)
- [Security Guidelines](#security-guidelines)

---

## What is Model Context Protocol?

The **Model Context Protocol (MCP)** is an open-standard protocol created by Anthropic that allows clients (such as AI desktop apps or IDE extensions) to connect to secure data sources and tools (MCP Servers). It decouples the AI model from specific tools, enabling developers to build and share integrations easily.

---

## Claude Desktop Configuration

To configure these servers globally in **Claude Desktop** on macOS:
1. Open the Claude Desktop configuration file. You can open it via Terminal:
   ```bash
   open ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```
2. Copy and paste the configuration template from [claude_desktop_config.template.json](./claude_desktop_config.template.json).
3. Replace the placeholder tokens (`YOUR_...`) with your actual API keys.
4. **Restart** the Claude Desktop application to reload the servers.

---

## 1. Figma MCP Server

Allows Claude to read Figma design files, inspect layouts, find components, and generate matching React code.

### 🔑 Get Credentials
1. Go to your **Figma Account Settings**.
2. Scroll down to the **Personal Access Tokens** section.
3. Click **Generate new token**, grant the `read` permission, and copy the token.

### 🛠️ Configuration
```json
"figma": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-figma"],
  "env": {
    "FIGMA_PERSONAL_ACCESS_TOKEN": "YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
  }
}
```

### 🧪 Test Scenario
Ask Claude:
> *"Extract the layout structure and color variables of the Figma file at `https://www.figma.com/file/YOUR_FILE_ID` and suggest how we can structure the React CSS classes to match."*

---

## 2. Firecrawl MCP Server

Enables Claude to search the web, scrape complex web pages, bypass anti-bot protections, and convert any URL into clean Markdown.

### 🔑 Get Credentials
1. Sign up on [Firecrawl](https://firecrawl.dev/).
2. Go to the dashboard and copy your **API Key**.

### 🛠️ Configuration
```json
"firecrawl": {
  "command": "npx",
  "args": ["-y", "firecrawl-mcp"],
  "env": {
    "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY"
  }
}
```

### 🧪 Test Scenario
Ask Claude:
> *"Scrape the main documentation page of Vite (`https://vite.dev`) using Firecrawl and summarize the core optimization strategies mentioned there."*

---

## 3. GitHub (The Manager) MCP Server

Allows Claude to perform repository management tasks: create issues, inspect branches, search code, edit files, and review Pull Requests.

### 🔑 Get Credentials
1. Go to your **GitHub Settings** > **Developer Settings** > **Personal Access Tokens** > **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Select `repo` (all permissions) and optionally `workflow`.
4. Copy the token.

### 🛠️ Configuration
```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"
  }
}
```

### 🧪 Test Scenario
Ask Claude:
> *"Look at my repository `github_username/repo_name`. Create a new issue titled 'Integrate Playwright End-to-End Tests' with the description 'We need to set up Playwright tests in our React pipeline.'"*

---

## 4. Sentry MCP Server

Gives Claude visibility into error reports, stack traces, and exception details in real-time, helping debug problems immediately.

### 🔑 Get Credentials
1. Go to your **Sentry Settings** > **Developer Settings** > **Auth Tokens**.
2. Click **Create New Token**, select scopes `org:read`, `project:read`, `event:read`, and copy the token.

### 🛠️ Configuration
```json
"sentry": {
  "command": "npx",
  "args": [
    "-y",
    "@sentry/mcp-server@latest",
    "--access-token=YOUR_SENTRY_AUTH_TOKEN"
  ]
}
```

### 🧪 Test Scenario
Ask Claude:
> *"Find the most frequent unresolved exception in our project and analyze the stack trace to suggest a fix."*

---

## 5. Playwright MCP Server

Allows Claude to control a browser locally: navigate, click, fill forms, and take screenshots of the React application to verify visual correctness.

### 🛠️ Configuration
```json
"playwright": {
  "command": "npx",
  "args": [
    "-y",
    "@playwright/mcp@latest"
  ]
}
```

### 🧪 Test Scenario
Ask Claude:
> *"Launch a browser using Playwright, navigate to `http://localhost:5173`, click the button to increment the counter, and verify that the UI updates correctly. Take a screenshot to show the final state."*

---

## Testing Scenarios

### Automated Playwright Test Scenario
We have built an automated test runner script in `mcp-integration/run_playwright_scenario.js`. This script acts as a test scenario validating that:
1. A background Vite development server can start automatically.
2. Playwright can open a headless browser and navigate to the application.
3. The page title and headings match the React template.
4. Clicking the **"Count is"** button correctly updates the React state to `Count is 1`.
5. A verification screenshot is captured and saved as `mcp-integration/scenario-screenshot.png`.

#### How to run:
1. Install Playwright and browser binaries in your project:
   ```bash
   npm install -D playwright
   npx playwright install chromium
   ```
2. Execute the test scenario:
   ```bash
   node mcp-integration/run_playwright_scenario.js
   ```
3. Check the output logs and open the newly generated screenshot `mcp-integration/scenario-screenshot.png` to confirm the run was successful.

---

## Testing MCP Servers One by One

There are two primary methods to test each MCP server in isolation:

### Method 1: Using the Official MCP Inspector (Recommended)
The **MCP Inspector** is an interactive web-based developer tool designed specifically to test MCP servers. It launches your server, exposes a debugger, and opens a web interface at `http://localhost:6274` where you can manually run tools and verify results.

Run the corresponding command in your terminal to inspect any individual server:

#### 1. Playwright
```bash
npx @modelcontextprotocol/inspector npx -y @playwright/mcp@latest
```

#### 2. Figma
```bash
npx @modelcontextprotocol/inspector -e FIGMA_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN_HERE npx -y @modelcontextprotocol/server-figma
```

#### 3. Firecrawl
```bash
npx @modelcontextprotocol/inspector -e FIRECRAWL_API_KEY=YOUR_KEY_HERE npx -y firecrawl-mcp
```

#### 4. GitHub
```bash
npx @modelcontextprotocol/inspector -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN_HERE npx -y @modelcontextprotocol/server-github
```

#### 5. Sentry
```bash
npx @modelcontextprotocol/inspector npx -y @sentry/mcp-server@latest --access-token=YOUR_TOKEN_HERE
```

*Note: Once the command is running, open `http://localhost:6274` in your web browser. You will see a list of all exposed tools and can click **"Call Tool"** to test them with custom parameters.*

---

### Method 2: Testing via Claude Desktop or Cursor (Incremental)
If you want to verify how the LLM behaves with each server individually inside Claude Desktop or Cursor:
1. Open your configuration file.
2. Add only **one** server configuration from the template at a time (e.g. start with `playwright` only).
3. Restart the app (Claude Desktop or Cursor).
4. Run a specific prompt that targets that server (e.g., *"Open a browser and navigate to example.com"*).
5. Verify it runs successfully. Once verified, add the next server to the config file and repeat.

---

## Security Guidelines

- **Never commit credentials**: Do not check in your configured `claude_desktop_config.json` with active API tokens. Use the template provided.
- **Token Rotation**: Set reasonable expiration dates on your Personal Access Tokens (e.g., GitHub and Figma).
- **Least Privilege**: Only grant the scopes needed by the tools (e.g., read-only for Figma unless you intend to design programmatically).

