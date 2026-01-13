# TODO

## 1. API Clients & Models
- [x] Implement Hardcover GraphQL API client (`internal/api/hardcover.go`)
- [x] Implement data models for Book, UserBook, List, etc. (`internal/models/book.go`)
- [x] Implement Oku API client (`internal/api/oku.go`)
- [x] Implement Goodreads API client (`internal/api/goodreads.go`)

## 2. CLI Commands
- [x] Implement root command with global flags for API key and output format (`cmd/root.go`)
- [x] Implement `search` command with all required flags and browser integration (`cmd/search.go`)
- [x] Implement `add` command with search, ISBN, and list support (`cmd/add.go`)
- [x] Implement `list` command with status, table, and custom list support (`cmd/list.go`)

## 3. Utilities
- [x] Implement browser opening utility (`internal/utils/browser.go`)
- [x] Implement table formatting utility (now using basic formatting) (`internal/utils/table.go`)

## 4. Testing
- [x] Write unit tests for all API clients:
- [x] Hardcover API client
- [x] Oku API client
- [x] Goodreads API client
- [x] All API client tests use real fixtures and local servers for reliability
- [ ] Write unit tests for CLI command logic (search, add, list)
- [ ] Write integration tests for end-to-end CLI usage

## 5. Missing requirements
- [ ] The Goodreads search feature should open the book page of the first result, not the search result page
- [ ] The Oku search fails to use the results of the search API to open the Oky book page based on the slug field (see fxture @docs/oku-search.json)
- [ ] The search function should only show the first result and should default to a JSON output. When -t is specified show a list (we'll do table later)
- [ ] The list function should show my books filtered by their status as described in @docs/hardcover-api/Blog.md

## 6. Error Handling & UX
- [ ] Improve error messages and user feedback for all commands
- [ ] Add graceful handling for network/API failures and timeouts
- [ ] Add more helpful output for empty results and edge cases

## 7. Documentation
- [ ] Write a comprehensive `README.md` with usage examples and setup instructions
- [ ] Document all commands and flags in `docs/`
- [ ] Update `docs/PLAN.md` and `docs/TEST_PLAN.md` as implementation progresses

## 8. Enhancements & Improvements
- [ ] Add support for more search types (authors, series, etc.) in the search command
- [ ] Allow selection of multiple books for batch operations
- [ ] Add support for removing books from lists
- [ ] Add support for updating book status (e.g., mark as read)
- [ ] Add configuration file support for persistent settings (API key, defaults)
- [ ] Add shell completion scripts for CLI
