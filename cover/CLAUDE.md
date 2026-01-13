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
