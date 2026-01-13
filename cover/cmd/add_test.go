package cmd

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
	"time"
	"fmt"

	"cover/internal/api"
	"cover/internal/models"
)

// testRunAdd is a test helper that runs add with a custom client
func testRunAdd(client *api.HardcoverClient, args []string) error {
	bookQuery := args[0]

	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

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
		// For tests, just use the first book
		selectedBook, err = client.ConvertSearchBookToBook(searchBooks[0])
		if err != nil {
			return fmt.Errorf("convert search book failed: %w", err)
		}
	}

	// Use default list for testing
	listID := 2
	targetName := "reading"

	// Show book details and confirm
	fmt.Printf("Adding book: %s to list: %s\n", selectedBook.Title, targetName)

	// Skip confirmation for tests (addYes is set to true)
	if !addYes {
		return fmt.Errorf("confirmation required")
	}

	// Add to list
	err = client.AddBookToList(selectedBook.ID, listID)
	if err != nil {
		return fmt.Errorf("failed to add book to list: %w", err)
	}

	fmt.Printf("Successfully added '%s' to %s.\n", selectedBook.Title, targetName)
	return nil
}

func TestRunAdd_NoAPIKey(t *testing.T) {
	// Test missing API key
	originalAPIKey := apiKey
	apiKey = ""
	defer func() { apiKey = originalAPIKey }()

	err := runAdd(nil, []string{"test"})
	if err == nil {
		t.Error("expected error for missing API key, got nil")
	}
	if !strings.Contains(err.Error(), "API key required") {
		t.Errorf("expected API key error, got: %v", err)
	}
}

func TestRunAdd_Success(t *testing.T) {
	// Mock API server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Parse the GraphQL query from request body
		var requestBody map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			t.Fatalf("failed to decode request body: %v", err)
		}

		// Check if it's a search query
		query, ok := requestBody["query"].(string)
		if !ok {
			t.Fatalf("expected query in request body, got: %v", requestBody)
		}

		if strings.Contains(query, "search") {
			// Return search results
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
						"per_page":   10,
					},
				},
			}
			json.NewEncoder(w).Encode(resp)
		} else if strings.Contains(query, "insert_list_book") {
			// Return add to list success
			resp := map[string]interface{}{
				"data": map[string]interface{}{
					"insert_list_book": map[string]interface{}{
						"id": 10, "list_id": 2, "book_id": 1, "date_added": time.Now().Format(time.RFC3339),
					},
				},
			}
			json.NewEncoder(w).Encode(resp)
		} else {
			http.NotFound(w, r)
		}
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	// Set yes flag to skip confirmation
	originalAddYes := addYes
	addYes = true
	defer func() { addYes = originalAddYes }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunAdd(client, []string{"test"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "Successfully added") {
		t.Errorf("output should contain 'Successfully added', got: %s", outputStr)
	}
}

func TestRunAdd_ISBN(t *testing.T) {
	// Mock API server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Parse the GraphQL query from request body
		var requestBody map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
			t.Fatalf("failed to decode request body: %v", err)
		}

		// Check if it's a search query
		query, ok := requestBody["query"].(string)
		if !ok {
			t.Fatalf("expected query in request body, got: %v", requestBody)
		}

		if strings.Contains(query, "search") {
			// Return search results
			resp := map[string]interface{}{
				"data": map[string]interface{}{
					"search": map[string]interface{}{
						"results": map[string]interface{}{
							"found": 1,
							"hits": []map[string]interface{}{
								{
									"document": map[string]interface{}{
										"id":           "2",
										"title":        "ISBN Book",
										"slug":         "isbn-book",
										"isbns":        []string{"456"},
										"author_names": []string{"Author2"},
										"contributions": []interface{}{},
										"rating":       4.0,
										"ratings_count": 50,
									},
								},
							},
						},
						"ids":        []string{"2"},
						"query":      "456",
						"query_type": "book",
						"page":       1,
						"per_page":   10,
					},
				},
			}
			json.NewEncoder(w).Encode(resp)
		} else if strings.Contains(query, "insert_list_book") {
			// Return add to list success
			resp := map[string]interface{}{
				"data": map[string]interface{}{
					"insert_list_book": map[string]interface{}{
						"id": 11, "list_id": 2, "book_id": 2, "date_added": time.Now().Format(time.RFC3339),
					},
				},
			}
			json.NewEncoder(w).Encode(resp)
		} else {
			http.NotFound(w, r)
		}
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	// Set API key
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	// Set yes flag to skip confirmation
	originalAddYes := addYes
	addYes = true
	defer func() { addYes = originalAddYes }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	err := testRunAdd(client, []string{"456"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "Successfully added") {
		t.Errorf("output should contain 'Successfully added', got: %s", outputStr)
	}
}

func TestRunAdd_NoResults(t *testing.T) {
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
					"per_page":   10,
				},
			},
		}
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

	err := testRunAdd(client, []string{"nonexistent"})
	if err == nil {
		t.Error("expected error for no results, got nil")
	}
	if !strings.Contains(err.Error(), "no books found") {
		t.Errorf("expected no results error, got: %v", err)
	}
}
