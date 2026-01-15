# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cover CLI is a Go-based command-line interface for managing book libraries through the Hardcover GraphQL API. It provides book search, library management, and integration with external services like Goodreads and Oku.


## Common Development Commands

### Building
```bash
go build -o cover
```

### Testing
```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific test suites
go test ./cmd
go test ./internal/api
go test ./internal/models
```

### Running the Application
```bash
# Set API key (required)
export HARDCOVER_API_KEY="your-api-key-here"

# Basic usage
./cover search "The Hobbit"
./cover add "Dune" --status 2
./cover list --status 3 --table
```

## Code Architecture

### Project Structure
- `main.go` - Entry point, delegates to cmd package
- `cmd/` - Cobra CLI commands (root, search, add, list)
- `internal/models/` - Data models for API responses and book representations
- `internal/api/` - API clients for Hardcover, Goodreads, and Oku services
- `internal/utils/` - Utility functions for browser opening and table formatting

### Key Components

#### Commands (`cmd/`)
- Uses Cobra framework for CLI structure
- `root.go` - Base command with global flags (--api-key, --json)
- `search.go` - Book search with multiple output formats and browser integration
- `add.go` - Add books to reading lists with status management
- `list.go` - View and filter reading lists with multiple output formats

#### API Clients (`internal/api/`)
- `hardcover.go` - Primary GraphQL client for Hardcover API
- `goodreads.go` - Web scraping client for Goodreads integration
- `oku.go` - REST client for Oku API integration
- All clients support timeout configuration and have corresponding test files

#### Data Models (`internal/models/`)
- Complex type hierarchy for different API response formats
- `SearchBook` vs `Book` vs `UserBook` - Different structures for different API endpoints
- Custom JSON marshaling for date handling
- Blog format conversion methods for content export

### API Integration Patterns
- GraphQL queries for Hardcover (primary data source)
- HTTP scraping for Goodreads URL discovery
- REST API calls for Oku integration
- All API clients implement timeout handling and error wrapping

### Testing Strategy
- Mocked HTTP responses instead of real API calls
- Test files alongside source code (`*_test.go`)
- Coverage reports available via `go test -cover`

## Environment Variables
- `HARDCOVER_API_KEY` - Required for API authentication (can also use --api-key flag)

## Dependencies
- `github.com/spf13/cobra` - CLI framework
- `golang.org/x/net` - Network utilities for HTML parsing
- Standard library for HTTP, JSON, and time handling

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- bv-agent-instructions-v1 -->

---

## Beads Workflow Integration

Use `bd` to manage tasks in this project. Whenever you finish a task, run `bd ready` to list tasks that are ready to be picked up. Then pick up the next task. Run `bd show $task_id` and ready the description.

### Essential Commands

```bash
# View issues (launches TUI - avoid in automated sessions)
bv

# CLI commands for agents (use these instead)
bd ready              # Show issues ready to work (no blockers)
bd list --status=open # All open issues
bd show <id>          # Full issue details with dependencies
bd create --title="..." --type=task --priority=2
bd update <id> --status=in_progress
bd close <id> --reason="Completed"
bd close <id1> <id2>  # Close multiple issues at once
bd sync               # Commit and push changes
```

### Workflow Pattern

1. **Start**: Run `bd ready` to find actionable work
2. **Claim**: Use `bd update <id> --status=in_progress`
3. **Work**: Implement the task
4. **Complete**: Use `bd close <id>`
5. **Sync**: Always run `bd sync` at session end

### Key Concepts

- **Dependencies**: Issues can block other issues. `bd ready` shows only unblocked work.
- **Priority**: P0=critical, P1=high, P2=medium, P3=low, P4=backlog (use numbers, not words)
- **Types**: task, bug, feature, epic, question, docs
- **Blocking**: `bd dep add <issue> <depends-on>` to add dependencies

### Session Protocol

**Before ending any session, run this checklist:**

```bash
git status              # Check what changed
git add <files>         # Stage code changes
bd sync                 # Commit beads changes
git commit -m "..."     # Commit code
bd sync                 # Commit any new beads changes
git push                # Push to remote
```

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (in_progress → closed)
- Create new issues with `bd create` when you discover tasks
- Use descriptive titles and set appropriate priority/type
- Always `bd sync` before ending session

<!-- end-bv-agent-instructions -->
