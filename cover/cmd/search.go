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
  cover search "Python" --per-page 10          # Limit results to 10 per page`,
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
}

func runSearch(cmd *cobra.Command, args []string) error {
	query := args[0]

	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

	// Create Hardcover client
	client := api.NewHardcoverClient(apiKey)

	// Perform search - always search for books
	searchResponse, err := client.SearchBooks(query, "books", perPage, 1, sortOrder)
	if err != nil {
		return fmt.Errorf("search failed: %w", err)
	}

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
	} else {
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
	}

	return nil
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
