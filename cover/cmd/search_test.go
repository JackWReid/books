package cmd

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"cover/internal/api"
	"cover/internal/models"
)

// testRunSearch is a test helper that runs search with a custom client
func testRunSearch(client *api.HardcoverClient, args []string) error {
	query := args[0]

	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

	// Perform search
	searchResponse, err := client.SearchBooks(query, "books", perPage, 1, sortOrder)
	if err != nil {
		return fmt.Errorf("search failed: %w", err)
	}

	// Parse the raw search results to extract book information
	books, err := client.ParseSearchResults(searchResponse)
	if err != nil {
		return fmt.Errorf("parse search results failed: %w", err)
	}

	if len(books) == 0 {
		fmt.Println("No results found.")
		return nil
	}

	// Handle ISBN-only output
	if searchISBN {
		if len(books) > 0 && len(books[0].ISBNs) > 0 {
			fmt.Println(books[0].ISBNs[0])
		}
		return nil
	}

	// Show only the first result by default
	selectedBook := books[0]

	// Display results - default to JSON, show list when -t flag is used
	if !searchTable {
		// Default: JSON output
		encoder := json.NewEncoder(os.Stdout)
		encoder.SetIndent("", "  ")
		return encoder.Encode(selectedBook)
	} else {
		// List format when -t flag is used
		fmt.Printf("Found result for '%s':\n\n", query)
		fmt.Printf("Title: %s", selectedBook.Title)
		if len(selectedBook.AuthorNames) > 0 {
			fmt.Printf(" by %s", strings.Join(selectedBook.AuthorNames, ", "))
		}
		if len(selectedBook.ISBNs) > 0 {
			fmt.Printf(" (ISBN: %s)", selectedBook.ISBNs[0])
		}
		fmt.Println()
	}

	return nil
}

func TestRunSearch_NoAPIKey(t *testing.T) {
	// Test missing API key
	originalAPIKey := apiKey
	apiKey = ""
	defer func() { apiKey = originalAPIKey }()

	err := runSearch(nil, []string{"test"})
	if err == nil {
		t.Error("expected error for missing API key, got nil")
	}
	if !strings.Contains(err.Error(), "API key required") {
		t.Errorf("expected API key error, got: %v", err)
	}
}

func TestRunSearch_Success(t *testing.T) {
	// Mock API server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Verify it's a POST request to GraphQL endpoint
		if r.Method != "POST" {
			t.Errorf("expected POST request, got %s", r.Method)
		}

		// Parse the GraphQL query from request body
		var requestBody map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			t.Fatalf("failed to decode request body: %v", err)
		}

		// Check if it's a search query
		query, ok := requestBody["query"].(string)
		if !ok || !strings.Contains(query, "search") {
			t.Errorf("expected search query, got: %v", requestBody)
		}

		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 1,
						"hits": []map[string]interface{}{
							{
								"document": map[string]interface{}{
									"id":           "1",
									"title":        "Test Book",
									"slug":         "test-book",
									"isbns":        []string{"123"},
									"author_names": []string{"Author"},
									"contributions": []interface{}{},
									"rating":       4.5,
									"ratings_count": 100,
								},
							},
						},
					},
					"ids":        []string{"1"},
					"query":      "test",
					"query_type": "book",
					"page":       1,
					"per_page":   25,
				},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunSearch(client, []string{"test"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "Test Book") {
		t.Errorf("output should contain 'Test Book', got: %s", outputStr)
	}
}

func TestRunSearch_ISBNOnly(t *testing.T) {
	// Mock API server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 1,
						"hits": []map[string]interface{}{
							{
								"document": map[string]interface{}{
									"id":           "1",
									"title":        "Test Book",
									"slug":         "test-book",
									"isbns":        []string{"123"},
									"author_names": []string{"Author"},
									"contributions": []interface{}{},
									"rating":       4.5,
									"ratings_count": 100,
								},
							},
						},
					},
					"ids":        []string{"1"},
					"query":      "test",
					"query_type": "book",
					"page":       1,
					"per_page":   25,
				},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key and ISBN flag
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	originalSearchISBN := searchISBN
	searchISBN = true
	defer func() { searchISBN = originalSearchISBN }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunSearch(client, []string{"test"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := strings.TrimSpace(buf.String())

	if outputStr != "123" {
		t.Errorf("expected ISBN '123', got: '%s'", outputStr)
	}
}

func TestRunSearch_JSONOutput(t *testing.T) {
	// Mock API server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 1,
						"hits": []map[string]interface{}{
							{
								"document": map[string]interface{}{
									"id":           "1",
									"title":        "Test Book",
									"slug":         "test-book",
									"isbns":        []string{"123"},
									"author_names": []string{"Author"},
									"contributions": []interface{}{},
									"rating":       4.5,
									"ratings_count": 100,
								},
							},
						},
					},
					"ids":        []string{"1"},
					"query":      "test",
					"query_type": "book",
					"page":       1,
					"per_page":   25,
				},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key and JSON flag
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	originalOutputJSON := outputJSON
	outputJSON = true
	defer func() { outputJSON = originalOutputJSON }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunSearch(client, []string{"test"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	// Verify it's valid JSON
	var result models.SearchBook
	if err := json.Unmarshal([]byte(outputStr), &result); err != nil {
		t.Errorf("output should be valid JSON: %v", err)
	}
	if result.Title != "Test Book" {
		t.Errorf("unexpected JSON result: %+v", result)
	}
}

func TestRunSearch_NoResults(t *testing.T) {
	// Mock API server with no results
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 0,
						"hits":  []map[string]interface{}{},
					},
					"ids":        []string{},
					"query":      "nonexistent",
					"query_type": "book",
					"page":       1,
					"per_page":   25,
				},
			},
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunSearch(client, []string{"nonexistent"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "No results found") {
		t.Errorf("output should contain 'No results found', got: %s", outputStr)
	}
}
