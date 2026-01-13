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
	listTable  bool
	listStatus int
	listBlog   bool
)

// listCmd represents the list command
var listCmd = &cobra.Command{
	Use:   "list [list-name]",
	Short: "Display your reading lists and books",
	Long: `Display your reading lists and books from Hardcover.

The list command can show your books by status or display specific lists.
You can use predefined status names like "reading", "toread", "read" or
specify a custom list name.

Examples:
  cover list reading                    # Show currently reading books (JSON)
  cover list toread                    # Show want to read books (JSON)
  cover list read                      # Show read books (JSON)
  cover list "sci-fi"                  # Show a custom list (JSON)
  cover list --status 2                # Show books with status ID 2 (JSON)
  cover list reading --table           # Display as formatted table
  cover list read --blog               # Output in blog format (matching blog-to-read.json)`,
	Args: cobra.MaximumNArgs(1),
	RunE: runList,
}

func init() {
	// List command flags
	listCmd.Flags().BoolVarP(&listTable, "table", "t", false, "Display as table instead of JSON")
	listCmd.Flags().IntVarP(&listStatus, "status", "s", 0, "Filter by book status (1=Want to Read, 2=Currently Reading, 3=Read)")
	listCmd.Flags().BoolVarP(&listBlog, "blog", "b", false, "Output in blog format (matching blog-to-read.json structure)")
}

func runList(cmd *cobra.Command, args []string) error {
	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

	// Create Hardcover client
	client := api.NewHardcoverClient(apiKey)

	var listName string
	if len(args) > 0 {
		listName = args[0]
	}

	// Determine what to display
	if listStatus > 0 {
		// Show books by status
		return displayBooksByStatus(client, listStatus)
	} else if listName != "" {
		// Show specific list
		return displaySpecificList(client, listName)
	} else {
		// Show all lists
		return displayAllLists(client)
	}
}

// displayBooksByStatus shows books filtered by status ID
func displayBooksByStatus(client *api.HardcoverClient, statusID int) error {
	userBooks, err := client.GetUserBooks(statusID)
	if err != nil {
		return fmt.Errorf("failed to get user books: %w", err)
	}

	if len(userBooks) == 0 {
		statusName := getStatusName(statusID)
		fmt.Printf("No books found with status: %s\n", statusName)
		return nil
	}

	if listTable {
		utils.PrintUserBooksTable(userBooks)
		return nil
	}

	if listBlog {
		// Convert to blog format
		blogBooks := models.ToBlogBooks(userBooks)
		encoder := json.NewEncoder(os.Stdout)
		encoder.SetIndent("", "  ")
		return encoder.Encode(blogBooks)
	}

	// Default: output full UserBook objects as JSON
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(userBooks)
}

// displaySpecificList shows books in a specific list
func displaySpecificList(client *api.HardcoverClient, listName string) error {
	// Handle predefined status names
	if statusID := getStatusID(listName); statusID > 0 {
		return displayBooksByStatus(client, statusID)
	}

	// Try to find list by name
	lists, err := client.GetUserLists()
	if err != nil {
		return fmt.Errorf("failed to get user lists: %w", err)
	}

	var targetList *models.List
	for _, list := range lists {
		if strings.EqualFold(list.Name, listName) {
			targetList = &list
			break
		}
	}

	if targetList == nil {
		return fmt.Errorf("list not found: %s", listName)
	}

	// Get books in the list
	listWithBooks, err := client.GetListBooks(targetList.ID)
	if err != nil {
		return fmt.Errorf("failed to get list books: %w", err)
	}

	if len(listWithBooks.ListBooks) == 0 {
		fmt.Printf("No books found in list: %s\n", listName)
		return nil
	}

	if listTable {
		utils.PrintListBooksTable(listWithBooks)
		return nil
	}

	// Default: output the full List object as JSON
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(listWithBooks)
}

// displayAllLists shows all user lists
func displayAllLists(client *api.HardcoverClient) error {
	lists, err := client.GetUserLists()
	if err != nil {
		return fmt.Errorf("failed to get user lists: %w", err)
	}

	if len(lists) == 0 {
		fmt.Println("No lists found.")
		return nil
	}

	if listTable {
		utils.PrintListsTable(lists)
		return nil
	}

	// Default: output all lists as JSON
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	return encoder.Encode(lists)
}

// getStatusName returns the human-readable name for a status ID
func getStatusName(statusID int) string {
	switch statusID {
	case 1:
		return "Want to Read"
	case 2:
		return "Currently Reading"
	case 3:
		return "Read"
	default:
		return fmt.Sprintf("Status %d", statusID)
	}
}

// getStatusID returns the status ID for a predefined status name
func getStatusID(statusName string) int {
	switch strings.ToLower(statusName) {
	case "reading", "currently reading":
		return 2
	case "toread", "want to read":
		return 1
	case "read":
		return 3
	default:
		return 0
	}
}
