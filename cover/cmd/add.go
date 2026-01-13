/*
Copyright © 2025 Jack Reid <jack@jackreid.dev>
*/
package cmd

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"cover/internal/api"
	"cover/internal/models"

	"github.com/spf13/cobra"
)

var (
	addYes    bool
	listName  string
	addTable  bool
	addStatus int
)

// addCmd represents the add command
var addCmd = &cobra.Command{
	Use:   "add [book]",
	Short: "Add a book to your library or a custom list",
	Long: `Add a book to your library with a status or to a custom list on Hardcover.

The add command searches for books by title and allows you to select from
search results. You can then choose to add the book to your library with a status
(Want to Read, Currently Reading, Read, Did Not Finish) or to one of your custom lists.

Examples:
  cover add "The Hobbit"                    # Search and add by title
  cover add "Dune" --status 2               # Add as "Currently Reading"
  cover add "1984" --list "sci-fi"          # Add to a specific list
  cover add "Python" --yes                  # Skip confirmation prompt`,
	Args: cobra.ExactArgs(1),
	RunE: runAdd,
}

func init() {
	// Add command flags
	addCmd.Flags().BoolVarP(&addTable, "table", "t", false, "Display as table instead of JSON")
	addCmd.Flags().IntVarP(&addStatus, "status", "s", 1, "Book status (1=Want to Read, 2=Currently Reading, 3=Read)")
	addCmd.Flags().BoolVarP(&addYes, "yes", "y", false, "Skip confirmation")
	addCmd.Flags().StringVarP(&listName, "list", "l", "reading", "List name or ID to add to")
}

func runAdd(cmd *cobra.Command, args []string) error {
	bookQuery := args[0]

	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

	// Create Hardcover client
	client := api.NewHardcoverClient(apiKey)

	// Search for book
	searchResponse, err := client.SearchBooks(bookQuery, "books", 10, 1, "")
	if err != nil {
		return fmt.Errorf("search failed: %w", err)
	}

	// Parse the search results
	searchBooks, err := client.ParseSearchResults(searchResponse)
	if err != nil {
		return fmt.Errorf("parse search results failed: %w", err)
	}

	if len(searchBooks) == 0 {
		return fmt.Errorf("no books found matching '%s'", bookQuery)
	}

	var selectedBook *models.Book

	if len(searchBooks) == 1 {
		// Convert the single search result to a Book
		selectedBook, err = client.ConvertSearchBookToBook(searchBooks[0])
		if err != nil {
			return fmt.Errorf("convert search book failed: %w", err)
		}
	} else {
		// Multiple results - prompt for selection
		selectedBook, err = promptForBookSelection(client, searchBooks)
		if err != nil {
			return err
		}
	}

	// Determine status ID or list ID
	var statusID int
	var listID int
	var targetName string
	var isStatus bool

	if cmd.Flags().Changed("status") {
		// Use the provided status
		statusID = addStatus
		switch addStatus {
		case 1:
			targetName = "Want to Read"
		case 2:
			targetName = "Currently Reading"
		case 3:
			targetName = "Read"
		case 5:
			targetName = "Did Not Finish"
		default:
			targetName = "Unknown"
		}
		isStatus = true
	} else if cmd.Flags().Changed("list") && listName != "" {
		// Use the provided list name or ID
		listID, err = getListID(client, listName)
		if err != nil {
			return fmt.Errorf("failed to get list: %w", err)
		}
		targetName = listName
		isStatus = false
	} else {
		// Prompt for status or list selection
		statusID, listID, targetName, isStatus, err = promptForStatusOrListSelection(client)
		if err != nil {
			return err
		}
	}

	// Show book details and confirm
	fmt.Printf("Adding book: %s", selectedBook.Title)
	if isStatus {
		fmt.Printf(" to library as: %s\n", targetName)
	} else {
		fmt.Printf(" to list: %s\n", targetName)
	}

	if !addYes {
		fmt.Print("Continue? (y/N): ")
		reader := bufio.NewReader(os.Stdin)
		response, err := reader.ReadString('\n')
		if err != nil {
			return fmt.Errorf("failed to read input: %w", err)
		}

		response = strings.TrimSpace(strings.ToLower(response))
		if response != "y" && response != "yes" {
			fmt.Println("Cancelled.")
			return nil
		}
	}

	// Add book to library or list
	if isStatus {
		err = client.AddBookToLibrary(selectedBook.ID, statusID)
		if err != nil {
			return fmt.Errorf("failed to add book to library: %w", err)
		}
		fmt.Printf("Successfully added '%s' to your library as %s!\n", selectedBook.Title, targetName)
	} else {
		err = client.AddBookToList(selectedBook.ID, listID)
		if err != nil {
			return fmt.Errorf("failed to add book to list: %w", err)
		}
		fmt.Printf("Successfully added '%s' to your %s list!\n", selectedBook.Title, targetName)
	}
	return nil
}

// promptForBookSelection displays search results and prompts user to select one
func promptForBookSelection(client *api.HardcoverClient, searchBooks []models.SearchBook) (*models.Book, error) {
	fmt.Println("Multiple books found. Please select one:")
	fmt.Println()

	for i, book := range searchBooks {
		author := "Unknown"
		if len(book.AuthorNames) > 0 {
			author = book.AuthorNames[0]
		}
		fmt.Printf("%d. %s by %s (Rating: %.1f)\n", i+1, book.Title, author, book.Rating)
	}

	fmt.Print("\nEnter selection (1-", len(searchBooks), "): ")
	reader := bufio.NewReader(os.Stdin)
	input, err := reader.ReadString('\n')
	if err != nil {
		return nil, fmt.Errorf("failed to read input: %w", err)
	}

	input = strings.TrimSpace(input)
	selection, err := strconv.Atoi(input)
	if err != nil {
		return nil, fmt.Errorf("invalid selection: %s", input)
	}

	if selection < 1 || selection > len(searchBooks) {
		return nil, fmt.Errorf("selection out of range: %d", selection)
	}

	// Convert the selected SearchBook to a Book
	selectedBook, err := client.ConvertSearchBookToBook(searchBooks[selection-1])
	if err != nil {
		return nil, fmt.Errorf("convert search book failed: %w", err)
	}

	return selectedBook, nil
}

// promptForStatusOrListSelection displays available statuses and lists and prompts user to select one
func promptForStatusOrListSelection(client *api.HardcoverClient) (int, int, string, bool, error) {
	// Define statuses
	statuses := []struct {
		ID   int
		Name string
	}{
		{1, "Want to Read"},
		{2, "Currently Reading"},
		{3, "Read"},
		{5, "Did Not Finish"},
	}

	// Fetch user lists
	lists, err := client.GetUserLists()
	if err != nil {
		return 0, 0, "", false, fmt.Errorf("failed to get user lists: %w", err)
	}

	// Display all options
	fmt.Println("Select status or list:")
	fmt.Println()

	// Show statuses first
	for i, status := range statuses {
		fmt.Printf("%d. %s\n", i+1, status.Name)
	}

	// Show lists
	for i, list := range lists {
		fmt.Printf("%d. %s (%d books)\n", i+1+len(statuses), list.Name, list.BooksCount)
	}

	totalOptions := len(statuses) + len(lists)
	fmt.Printf("\nEnter selection (1-%d): ", totalOptions)
	reader := bufio.NewReader(os.Stdin)
	input, err := reader.ReadString('\n')
	if err != nil {
		return 0, 0, "", false, fmt.Errorf("failed to read input: %w", err)
	}

	input = strings.TrimSpace(input)
	selection, err := strconv.Atoi(input)
	if err != nil || selection < 1 || selection > totalOptions {
		return 0, 0, "", false, fmt.Errorf("invalid selection: %s", input)
	}

	// Determine if selection is a status or list
	if selection <= len(statuses) {
		// It's a status
		selectedStatus := statuses[selection-1]
		return selectedStatus.ID, 0, selectedStatus.Name, true, nil
	} else {
		// It's a list
		listIndex := selection - 1 - len(statuses)
		selectedList := lists[listIndex]
		return 0, selectedList.ID, selectedList.Name, false, nil
	}
}

// getListID resolves a list name or ID to a list ID
func getListID(client *api.HardcoverClient, listIdentifier string) (int, error) {
	// Try to parse as integer (list ID)
	if listID, err := strconv.Atoi(listIdentifier); err == nil {
		return listID, nil
	}

	// Try to find by name
	lists, err := client.GetUserLists()
	if err != nil {
		return 0, fmt.Errorf("failed to get user lists: %w", err)
	}

	// Search for custom list by name
	for _, list := range lists {
		if strings.EqualFold(list.Name, listIdentifier) {
			return list.ID, nil
		}
	}

	return 0, fmt.Errorf("list not found: %s", listIdentifier)
}
