# Cover CLI

A powerful command-line interface for managing your book library on [Hardcover](https://hardcover.app). Cover CLI provides seamless integration with the Hardcover GraphQL API, allowing you to search for books, manage your reading lists, and track your reading progress directly from your terminal.

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Commands](#commands)
  - [Search](#search)
  - [Add](#add)
  - [List](#list)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [Integration with External Services](#integration-with-external-services)
- [Output Formats](#output-formats)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Installation

### From Source

```bash
git clone https://github.com/yourusername/cover.git
cd cover
go build -o cover
```

### Binary Installation

Download the latest binary from the [releases page](https://github.com/yourusername/cover/releases) and place it in your PATH.

## Authentication

Cover CLI requires a Hardcover API key to function. You can obtain your API key from your Hardcover account settings.

### Setting up your API key

You can provide your API key in several ways:

1. **Environment Variable (Recommended)**:
   ```bash
   export HARDCOVER_API_KEY="your-api-key-here"
   ```

2. **Command-line flag**:
   ```bash
   cover search "The Hobbit" --api-key your-api-key-here
   ```

3. **Add to your shell profile** for persistent use:
   ```bash
   echo 'export HARDCOVER_API_KEY="your-api-key-here"' >> ~/.bashrc
   source ~/.bashrc
   ```

## Commands

### Search

Search for books in the Hardcover database with powerful filtering and output options.

#### Basic Usage

```bash
cover search "The Hobbit"
cover search "Dune Frank Herbert"
cover search "978-0547928227"  # Search by ISBN
```

#### Search Options

- `--isbn, -i`: Return only the ISBN of the first result
- `--table, -t`: Display compact text output
- `--hardcover`: Open the book's Hardcover page in your browser
- `--goodreads, -g`: Open the book's Goodreads page in your browser
- `--oku, -o`: Open the book's Oku page in your browser
- `--per-page, -p`: Number of results per page (default: 25)
- `--sort, -s`: Sort order (default: "activities_count:desc")
- `--json`: Output JSON (global flag)

#### Search Examples

**Get just the ISBN of a book**:
```bash
cover search "The Hobbit" --isbn
# Output: 978-0547928227
```

**Search and open in browser**:
```bash
cover search "Dune" --hardcover --goodreads
# Opens both Hardcover and Goodreads pages for Dune
```

**Formatted table output**:
```bash
cover search "Python programming" --table
# Displays results in a readable table format
```

**Advanced search with custom sorting**:
```bash
cover search "science fiction" --per-page 10 --sort "rating:desc"
```

### Add

Add books to your library or custom lists with various status options.

#### Basic Usage

```bash
cover add "The Hobbit"
cover add "978-0547928227"  # Add by ISBN
```

#### Add Options

- `--status, -s`: Set reading status (1=Want to Read, 2=Currently Reading, 3=Read, 5=Did Not Finish)
- `--list, -l`: Add to a specific list by name (default: "reading")
- `--yes, -y`: Skip confirmation prompt
- `--table, -t`: Display book details in table format before adding

#### Reading Status Codes

- `1`: Want to Read
- `2`: Currently Reading  
- `3`: Read
- `5`: Did Not Finish

#### Add Examples

**Add to "Want to Read" status**:
```bash
cover add "The Hobbit" --status 1 --yes
```

**Add to "Currently Reading"**:
```bash
cover add "Dune" --status 2
```

**Add to a custom list**:
```bash
cover add "1984" --list "dystopian-novels"
```

**Add multiple books with automation**:
```bash
cover add "The Fellowship of the Ring" --status 2 --yes
cover add "The Two Towers" --status 1 --yes
cover add "The Return of the King" --status 1 --yes
```

**Interactive mode** (prompts for confirmation):
```bash
cover add "The Hobbit"
# Prompts: Continue? (y/N):
```

### List

View and manage your reading lists and library with flexible filtering options.

#### Basic Usage

```bash
cover list                    # Show all your lists
cover list reading           # Show books in "reading" list
cover list "Want to Read"    # Show books with "Want to Read" status
```

#### List Options

- `--status, -s`: Filter by reading status (1-5)
- `--table, -t`: Display in table format (default)
- `--json`: Output in JSON format (global flag)
- `--blog, -b`: Output in blog format (matching blog-to-read.json structure, requires `--json`)

#### Status-Based Listing

```bash
cover list --status 1        # Want to Read
cover list --status 2        # Currently Reading
cover list --status 3        # Read
cover list --status 5        # Did Not Finish
```

#### List Examples

**View all your lists**:
```bash
cover list
# Shows: Reading List (5 books), Favorites (12 books), etc.
```

**View currently reading books**:
```bash
cover list --status 2 --table
```

**Export reading list for blog**:
```bash
cover list --status 3 --blog --json > my-read-books.json
```

**Get JSON data for integration**:
```bash
cover list "sci-fi" --json | jq '.[] | .book.title'
```

## Configuration

### Environment Variables

- `HARDCOVER_API_KEY`: Your Hardcover API key (required)

### Global Flags

All commands support these global flags:

- `--api-key`: Override the API key for a single command
- `--help, -h`: Show help information
- `--version, -v`: Show version information

## Usage Examples

### Daily Reading Workflow

**Morning routine - check your reading queue**:
```bash
cover list --status 2 --table  # See what you're currently reading
cover list --status 1          # Check your "Want to Read" list
```

**Add a book you just heard about**:
```bash
cover search "The Seven Husbands of Evelyn Hugo" --table
cover add "The Seven Husbands of Evelyn Hugo" --status 1 --yes
```

**Mark a book as finished**:
```bash
cover add "The Hobbit" --status 3 --yes
```

### Book Discovery Workflow

**Discover and research a book**:
```bash
# Search for the book
cover search "Project Hail Mary" --table

# Open multiple services to research
cover search "Project Hail Mary" --hardcover --goodreads --oku

# Add to want-to-read if you like it
cover add "Project Hail Mary" --status 1 --yes
```

### List Management

**Create and manage themed lists**:
```bash
# Add books to a custom list
cover add "Neuromancer" --list "cyberpunk"
cover add "Snow Crash" --list "cyberpunk" 
cover add "The Matrix" --list "cyberpunk"

# View the list
cover list cyberpunk --table
```

### Blog Integration

**Generate content for your book blog**:
```bash
# Export recently read books
cover list --status 3 --blog --json > recent-reads.json

# Get reading stats
cover list --status 3 --json | jq 'length'  # Total books read
cover list --status 2 --json | jq 'length'  # Currently reading count
```

## Advanced Features

### Browser Integration

Cover CLI can automatically open book pages in your browser:

```bash
# Research a book across multiple platforms
cover search "The Expanse" --hardcover --goodreads --oku
```

This opens three browser tabs:
- Hardcover page with community reviews and ratings
- Goodreads page with detailed reviews and similar books
- Oku page with additional metadata and links

### Automation and Scripting

**Batch add books from a list**:
```bash
#!/bin/bash
books=(
    "Dune"
    "Foundation" 
    "Hyperion"
    "The Left Hand of Darkness"
)

for book in "${books[@]}"; do
    cover add "$book" --status 1 --yes
    echo "Added: $book"
done
```

**Reading progress tracking**:
```bash
#!/bin/bash
# Daily reading check-in script

echo "=Ú Current Reading Status:"
echo "========================="
echo "Currently Reading:"
cover list --status 2 --table

echo -e "\nWant to Read Queue:"
cover list --status 1 --json | jq -r '.[0:3][] | "- " + .book.title'

echo -e "\nBooks Read This Year:"
cover list --status 3 --json | jq 'length'
```

### Data Export and Backup

**Export your entire library**:
```bash
# Export all lists
cover list --json > my-library-backup.json

# Export specific reading statuses
cover list --status 3 --json > books-read.json
cover list --status 1 --json > want-to-read.json
cover list --status 2 --json > currently-reading.json
```

## Integration with External Services

### Goodreads Integration

Cover CLI can search Goodreads and open book pages:

```bash
cover search "The Hobbit" --goodreads
```

### Oku Integration  

Similarly for Oku (a modern book tracking service):

```bash
cover search "Dune" --oku
```

### Combining Services

Research a book across all platforms:

```bash
cover search "Klara and the Sun" --hardcover --goodreads --oku --table
```

## Output Formats

### JSON Output (Default)

```json
{
  "id": "12345",
  "title": "The Hobbit",
  "slug": "the-hobbit",
  "author_names": ["J.R.R. Tolkien"],
  "isbns": ["978-0547928227"],
  "rating": 4.5,
  "ratings_count": 2500
}
```

### Table Output

```
                     ,                  ,        ,                  
 Title                Author            Rating  ISBN             
                     <                  <        <                  $
 The Hobbit           J.R.R. Tolkien    4.5     978-0547928227   
                     4                  4        4                  
```

### Blog Format

```json
[
  {
    "date_updated": "2024-01-15",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "image_url": "https://images.hardcover.app/...",
    "hardcover_url": "https://hardcover.app/books/the-hobbit"
  }
]
```

## Troubleshooting

### Common Issues

**API Key Not Set**:
```
Error: API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag
```
Solution: Set your API key as described in the [Authentication](#authentication) section.

**Book Not Found**:
```
Error: no books found matching 'xyz'
```
Solution: Try different search terms, check spelling, or search by ISBN.

**Network Issues**:
```
Error: search failed: API request failed with status: 500
```
Solution: Check your internet connection and try again. If the issue persists, Hardcover's API may be experiencing issues.

### Debug Mode

For detailed debugging information, you can inspect the API calls:

```bash
# Enable verbose HTTP logging (if implemented)
export HARDCOVER_DEBUG=true
cover search "The Hobbit"
```

### Getting Help

- Use `cover --help` for general help
- Use `cover [command] --help` for command-specific help
- Check the [issues page](https://github.com/yourusername/cover/issues) for known problems
- Create a new issue if you encounter bugs

## Contributing

We welcome contributions! Please see our [contributing guidelines](CONTRIBUTING.md) for details on:

- Setting up the development environment
- Running tests
- Submitting pull requests
- Code style guidelines

### Development Setup

```bash
git clone https://github.com/yourusername/cover.git
cd cover
go mod download
go test ./...
go build -o cover
```

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run specific test suites
go test ./cmd
go test ./internal/api
```

---

**License**: MIT

**Author**: Jack Reid

**Repository**: https://github.com/yourusername/cover

For more information, visit [Hardcover](https://hardcover.app) to create your account and get your API key.