# Community Agent Template TEST

Open source AI-powered Slack community management bot with a built-in Next.js admin panel. Uses Chat SDK, AI SDK, and Vercel Workflow.

**Template.** Fork it, customize it, and deploy your own AI community manager with Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fcommunity-agent-template&env=COMMUNITY_NAME,BETTER_AUTH_SECRET,SLACK_CLIENT_ID,SLACK_CLIENT_SECRET,SLACK_TEAM_ID&envDescription=COMMUNITY_NAME%3A%20Name%20in%20bot%20responses%20%7C%20BETTER_AUTH_SECRET%3A%20Run%20%60openssl%20rand%20-base64%2032%60%20%7C%20SLACK_CLIENT_ID%20%26%20SLACK_CLIENT_SECRET%3A%20From%20Slack%20app%20Basic%20Information%20%7C%20SLACK_TEAM_ID%3A%20Workspace%20ID.%20Add%20AI%20keys%20after%20deploy.&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fcommunity-agent-template%23configure-environment-variables&project-name=community-agent&repository-name=community-agent&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22turso%22%7D%5D)

## Features

- **Community manager AI** — Routes questions, welcomes members, surfaces unanswered threads, and flags issues to a lead. Powered by [AI SDK](https://ai-sdk.dev)
- **Channel-aware routing** — Configurable channel map so the bot knows your workspace layout and where to send people
- **Durable workflows** — Every LLM call and tool execution is a checkpoint with automatic retries via [Vercel Workflow](https://vercel.com/docs/workflow)
- **Web search** — Claude's native web search and fetch tools, scoped to your community's domains via `SEARCH_DOMAINS`. Model switching and fallbacks through [AI Gateway](https://vercel.com/docs/ai-gateway)
- **Sandbox execution** — Optional `bash`/`bash_batch` tools for running commands in a sandboxed environment via the [Knowledge Agent Template](https://github.com/vercel-labs/knowledge-agent-template) API
- **Native Slack UI** — Typing indicators, threaded replies, and DMs. Powered by [Chat SDK](https://chat-sdk.dev)
- **Live dashboard** — Real-time streaming indicators show active conversations as they happen, with stats that update automatically when the bot finishes responding
- **Admin panel** — Dashboard with activity feed, stats, and full conversation history. Slack OAuth via [Better Auth](https://www.better-auth.com)

## Quick Start

Try the admin panel without setting up Slack:

1. Import the repo on [vercel.com/new](https://vercel.com/new)
2. Add a `COMMUNITY_NAME` env var (e.g. `DevHub`)
3. Deploy — the dashboard works immediately with mock data

For the full Slack bot setup, see [docs/setup.md](docs/setup.md).

## Customization

| What to change      | File                                | Details                                  |
| ------------------- | ----------------------------------- | ---------------------------------------- |
| Bot personality      | `lib/agent.ts`                      | System prompt and instructions           |
| Channel map          | `lib/channels.ts`                   | Must match your Slack workspace          |
| Welcome message      | `lib/welcome.ts`                    | Sent when new members join               |
| Agent tools          | `workflows/agent-workflow/tools.ts` | Add, remove, or modify tools             |
| Auth config          | `lib/auth.ts`                       | Slack OAuth for the admin panel          |

### Knowledge Base

This template is designed to work alongside the [Knowledge Agent Template](https://github.com/vercel-labs/knowledge-agent-template). Set `SAVOIR_API_URL` to connect to a deployed Savoir backend, giving the bot `bash` and `bash_batch` tools to search and read your community docs remotely. Without it, the bot still works using web search, channel routing, and the system prompt.

## Docs

- [Full setup guide](docs/setup.md) — Slack app, env vars, storage, OAuth, channels, deploy
- [Architecture](docs/architecture.md) — How the bot works, key files, workflow constraints
- [Testing](docs/testing.md) — Test without Slack, simulate actions, mock data

## Built With

- [Next.js 16](https://nextjs.org) — React framework with cacheComponents and React Compiler
- [Chat SDK](https://chat-sdk.dev) — Slack adapter and bot framework
- [AI SDK 6](https://ai-sdk.dev) — AI model integration with AI Gateway support
- [Vercel Workflow](https://vercel.com/docs/workflow) — Durable workflow execution
- [Better Auth](https://www.better-auth.com) — Slack OAuth for the admin panel
- [shadcn/ui](https://ui.shadcn.com) — Component library
- [Upstash Redis](https://upstash.com) — Bot action logging, stats, and conversation storage

## License

MIT
