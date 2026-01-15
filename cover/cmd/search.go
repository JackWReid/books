/*
Copyright © 2025 Jack Reid <jack@jackreid.dev>
*/
package cmd

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"cover/internal/api"
	"cover/internal/models"
	"cover/internal/utils"

	"github.com/spf13/cobra"
)

var (
	searchISBN    bool
	openHardcover bool
	openGoodreads bool
	openOku       bool
	perPage       int
	sortOrder     string
	searchTable   bool
	searchType    string
)

// searchCmd represents the search command
var searchCmd = &cobra.Command{
	Use:   "search [query]",
	Short: "Search for books using the Hardcover API",
	Long: `Search for books using the Hardcover GraphQL API.

The search command can open book pages in your browser and integrate with external services
like Goodreads and Oku for additional book information.

Examples:
  cover search "The Hobbit"                    # Search for a book
  cover search "Dune" --hardcover              # Search and open Hardcover page
  cover search "1984" --goodreads --oku        # Search and open multiple services
  cover search "Python" --per-page 10          # Limit results to 10 per page
  cover search "Asimov" --type author          # Search for authors
  cover search "Dune" --type series            # Search for series`,
	Args: cobra.ExactArgs(1),
	RunE: runSearch,
}

func init() {
	// Search command flags
	searchCmd.Flags().BoolVarP(&searchISBN, "isbn", "i", false, "Return only ISBN")
	searchCmd.Flags().BoolVar(&openHardcover, "hardcover", false, "Open Hardcover page")
	searchCmd.Flags().BoolVarP(&openGoodreads, "goodreads", "g", false, "Open Goodreads page")
	searchCmd.Flags().BoolVarP(&openOku, "oku", "o", false, "Open Oku page")
	searchCmd.Flags().IntVarP(&perPage, "per-page", "p", 25, "Results per page")
	searchCmd.Flags().StringVarP(&sortOrder, "sort", "s", "activities_count:desc", "Sort order")
	searchCmd.Flags().BoolVarP(&searchTable, "table", "t", false, "Show results as a list")
	searchCmd.Flags().StringVar(&searchType, "type", "books", "Search type (books, authors, series)")
}

func runSearch(cmd *cobra.Command, args []string) error {
	query := args[0]
	normalizedType, err := normalizeSearchType(searchType)
	if err != nil {
		return err
	}

	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

	// Create Hardcover client
	client := api.NewHardcoverClient(apiKey)

	if normalizedType != "books" && (openHardcover || openGoodreads || openOku || searchISBN) {
		return fmt.Errorf("open/ISBN flags are only supported for book searches")
	}

	// Perform search
	searchResponse, err := client.SearchBooks(query, normalizedType, perPage, 1, sortOrder)
	if err != nil {
		return fmt.Errorf("search failed: %w", err)
	}

	if normalizedType == "books" {
		// Parse the search results to extract SearchBook information
		searchBooks, err := client.ParseSearchResults(searchResponse)
		if err != nil {
			return fmt.Errorf("parse search results failed: %w", err)
		}

		if len(searchBooks) == 0 {
			fmt.Println("No results found.")
			return nil
		}

		// Show only the first result by default
		selectedBook := searchBooks[0]

		// Handle browser opening flags first
		if openHardcover || openGoodreads || openOku {
			if openHardcover {
				hardcoverURL := fmt.Sprintf("https://hardcover.app/books/%s", selectedBook.Slug)
				fmt.Printf("Opening Hardcover page: %s\n", hardcoverURL)
				if err := utils.OpenURL(hardcoverURL); err != nil {
					fmt.Fprintf(os.Stderr, "Warning: Failed to open Hardcover page: %v\n", err)
				}
			}

			if openGoodreads {
				goodreadsURL, err := getGoodreadsURL(selectedBook.Title)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Warning: Failed to get Goodreads URL: %v\n", err)
				} else {
					fmt.Printf("Opening Goodreads page: %s\n", goodreadsURL)
					if err := utils.OpenURL(goodreadsURL); err != nil {
						fmt.Fprintf(os.Stderr, "Warning: Failed to open Goodreads page: %v\n", err)
					}
				}
			}

			if openOku {
				okuURL, err := getOkuURL(selectedBook.Title)
				if err != nil {
					fmt.Fprintf(os.Stderr, "Warning: Failed to get Oku URL: %v\n", err)
				} else {
					fmt.Printf("Opening Oku page: %s\n", okuURL)
					if err := utils.OpenURL(okuURL); err != nil {
						fmt.Fprintf(os.Stderr, "Warning: Failed to open Oku page: %v\n", err)
					}
				}
			}
		}

		// Display results - default to JSON, show list when -t flag is used
		if !searchTable {
			// Default: JSON output
			encoder := json.NewEncoder(os.Stdout)
			encoder.SetIndent("", "  ")
			return encoder.Encode(selectedBook)
		}

		// List format when -t flag is used
		fmt.Printf("Found result for '%s':\n\n", query)
		fmt.Printf("ID: %s\n", selectedBook.ID)
		fmt.Printf("Title: %s\n", selectedBook.Title)
		fmt.Printf("Slug: %s\n", selectedBook.Slug)

		if selectedBook.Description != nil && *selectedBook.Description != "" {
			// Truncate description if it's too long
			desc := *selectedBook.Description
			if len(desc) > 200 {
				desc = desc[:200] + "..."
			}
			fmt.Printf("Description: %s\n", desc)
		}

		if selectedBook.Image != nil && selectedBook.Image.URL != nil {
			fmt.Printf("Image: %s\n", *selectedBook.Image.URL)
		}

		if len(selectedBook.ISBNs) > 0 {
			fmt.Printf("ISBNs: %s\n", strings.Join(selectedBook.ISBNs, ", "))
		}

		fmt.Printf("Rating: %.1f (%d ratings)\n", selectedBook.Rating, selectedBook.RatingsCount)
		return nil
	}

	searchDocs, err := parseSearchDocuments(searchResponse)
	if err != nil {
		return fmt.Errorf("parse search results failed: %w", err)
	}

	if len(searchDocs) == 0 {
		fmt.Println("No results found.")
		return nil
	}

	selectedDoc := searchDocs[0]
	if !searchTable {
		encoder := json.NewEncoder(os.Stdout)
		encoder.SetIndent("", "  ")
		return encoder.Encode(selectedDoc)
	}

	printSearchDocument(query, normalizedType, selectedDoc)
	return nil
}

func normalizeSearchType(raw string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "", "book", "books":
		return "books", nil
	case "author", "authors":
		return "authors", nil
	case "series":
		return "series", nil
	default:
		return "", fmt.Errorf("unsupported search type %q (supported: books, authors, series)", raw)
	}
}

func parseSearchDocuments(searchResp *models.SearchResponse) ([]map[string]interface{}, error) {
	if searchResp.Results.Found == 0 {
		return []map[string]interface{}{}, nil
	}

	docs := make([]map[string]interface{}, 0, len(searchResp.Results.Hits))
	for _, hit := range searchResp.Results.Hits {
		var doc map[string]interface{}
		if err := json.Unmarshal(hit.Document, &doc); err != nil {
			return nil, err
		}
		docs = append(docs, doc)
	}

	return docs, nil
}

func printSearchDocument(query, searchType string, doc map[string]interface{}) {
	fmt.Printf("Found result for '%s' (%s):\n\n", query, searchType)
	if id := getSearchDocString(doc, "id"); id != "" {
		fmt.Printf("ID: %s\n", id)
	}
	if name := getSearchDocString(doc, "name", "title"); name != "" {
		fmt.Printf("Name: %s\n", name)
	}
	if slug := getSearchDocString(doc, "slug"); slug != "" {
		fmt.Printf("Slug: %s\n", slug)
	}
	if count := getSearchDocNumber(doc, "books_count", "book_count"); count != "" {
		fmt.Printf("Books: %s\n", count)
	}
}

func getSearchDocString(doc map[string]interface{}, keys ...string) string {
	for _, key := range keys {
		value, ok := doc[key]
		if !ok {
			continue
		}
		switch typed := value.(type) {
		case string:
			return typed
		case fmt.Stringer:
			return typed.String()
		case float64:
			if typed == float64(int64(typed)) {
				return fmt.Sprintf("%d", int64(typed))
			}
			return fmt.Sprintf("%f", typed)
		case int:
			return fmt.Sprintf("%d", typed)
		case int64:
			return fmt.Sprintf("%d", typed)
		}
	}
	return ""
}

func getSearchDocNumber(doc map[string]interface{}, keys ...string) string {
	for _, key := range keys {
		value, ok := doc[key]
		if !ok {
			continue
		}
		switch typed := value.(type) {
		case float64:
			return fmt.Sprintf("%d", int64(typed))
		case int:
			return fmt.Sprintf("%d", typed)
		case int64:
			return fmt.Sprintf("%d", typed)
		}
	}
	return ""
}

// getGoodreadsURL attempts to find a Goodreads URL for the book using the API client
func getGoodreadsURL(title string) (string, error) {
	client := api.NewGoodreadsClient()
	book, err := client.SearchBook(title)
	if err != nil {
		return "", fmt.Errorf("failed to find Goodreads book: %w", err)
	}
	return book.URL, nil
}

// getOkuURL attempts to find an Oku URL for the book using the API client
func getOkuURL(title string) (string, error) {
	client := api.NewOkuClient()
	book, err := client.SearchBook(title)
	if err != nil {
		return "", fmt.Errorf("failed to find Oku book: %w", err)
	}
	return book.URL, nil
}
