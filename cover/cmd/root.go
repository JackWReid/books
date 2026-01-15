/*
Copyright © 2025 Jack Reid <jack@jackreid.dev>
*/
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	apiKey     string
	outputJSON bool
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "cover",
	Short: "A CLI tool for managing your book library with Hardcover",
	Long: `Cover is a command-line interface for managing your book library using the Hardcover GraphQL API.

Examples:
  cover search "The Hobbit"           # Search for a book
  cover add "Dune"                    # Add a book to your reading list
  cover list reading                  # Show your currently reading list
  cover list --status read            # Show your read books`,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func init() {
	rootCmd.AddCommand(searchCmd)
	rootCmd.AddCommand(addCmd)
	rootCmd.AddCommand(listCmd)

	// Global flags
	rootCmd.PersistentFlags().StringVar(&apiKey, "api-key", "", "Hardcover API key (or set HARDCOVER_API_KEY env var)")
	rootCmd.PersistentFlags().BoolVar(&outputJSON, "json", false, "Output results in JSON format")

	// Set API key from environment variable if not provided via flag
	if apiKey == "" {
		apiKey = os.Getenv("HARDCOVER_API_KEY")
	}
}
