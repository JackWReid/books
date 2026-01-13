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
)

// testRunList is a test helper that runs list with a custom client
func testRunList(client *api.HardcoverClient, args []string) error {
	// Validate API key
	if apiKey == "" {
		return fmt.Errorf("API key required. Set HARDCOVER_API_KEY environment variable or use --api-key flag")
	}

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

func TestRunList_NoAPIKey(t *testing.T) {
	originalAPIKey := apiKey
	apiKey = ""
	defer func() { apiKey = originalAPIKey }()

	err := runList(nil, []string{})
	if err == nil {
		t.Error("expected error for missing API key, got nil")
	}
	if !strings.Contains(err.Error(), "API key required") {
		t.Errorf("expected API key error, got: %v", err)
	}
}

func TestRunList_AllLists(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"lists": []map[string]interface{}{
							{"id": 1, "name": "Reading List", "slug": "reading-list", "description": "My reading list", "books_count": 3, "public": true, "list_books": []interface{}{}},
							{"id": 2, "name": "Favorites", "slug": "favorites", "description": "Favorite books", "books_count": 5, "public": false, "list_books": []interface{}{}},
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

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

	err := testRunList(client, []string{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()
	if !strings.Contains(outputStr, "Reading List") || !strings.Contains(outputStr, "Favorites") {
		t.Errorf("output should contain both lists, got: %s", outputStr)
	}
}

func TestRunList_NoResults(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"lists": []map[string]interface{}{},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

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

	err := testRunList(client, []string{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()
	if !strings.Contains(outputStr, "No lists found") {
		t.Errorf("output should contain 'No lists found', got: %s", outputStr)
	}
}

func TestRunList_StatusBased(t *testing.T) {
	// Mock API server for get user books by status
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"user_books": []map[string]interface{}{
							{"id": 1, "status_id": 2, "rating": nil, "review_raw": nil, "date_added": time.Now().Format(time.RFC3339), "book": map[string]interface{}{"id": 1, "title": "Currently Reading Book", "slug": "currently-reading"}},
							{"id": 2, "status_id": 2, "rating": 4, "review_raw": "Great book", "date_added": time.Now().Format(time.RFC3339), "book": map[string]interface{}{"id": 2, "title": "Another Reading Book", "slug": "another-reading"}},
						},
					},
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

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	err := testRunList(client, []string{"reading"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "Currently Reading Book") || !strings.Contains(outputStr, "Another Reading Book") {
		t.Errorf("output should contain both reading books, got: %s", outputStr)
	}
}

func TestRunList_CustomList(t *testing.T) {
	// Mock API server for get user lists (to find the custom list)
	listsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"lists": []map[string]interface{}{
							{"id": 3, "name": "Custom List", "slug": "custom-list", "description": "A custom list", "books_count": 2, "public": true, "list_books": []interface{}{}},
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})

	// Mock API server for get list books
	listBooksHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"lists_by_pk": map[string]interface{}{
					"id": 3, "name": "Custom List", "slug": "custom-list", "description": "A custom list", "books_count": 2, "public": true, "list_books": []map[string]interface{}{
						{"book": map[string]interface{}{"id": 3, "title": "Custom Book 1", "slug": "custom-book-1"}, "position": 1, "date_added": time.Now().Format(time.RFC3339)},
						{"book": map[string]interface{}{"id": 4, "title": "Custom Book 2", "slug": "custom-book-2"}, "position": 2, "date_added": time.Now().Format(time.RFC3339)},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})

	// Create test server that handles different endpoints
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body := make([]byte, 1024)
		n, _ := r.Body.Read(body)
		bodyStr := string(body[:n])

		if strings.Contains(bodyStr, "lists") && !strings.Contains(bodyStr, "lists_by_pk") {
			listsHandler.ServeHTTP(w, r)
		} else if strings.Contains(bodyStr, "lists_by_pk") {
			listBooksHandler.ServeHTTP(w, r)
		} else {
			http.NotFound(w, r)
		}
	}))
	defer server.Close()

	// Set API key
	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	err := testRunList(client, []string{"Custom List"})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	if !strings.Contains(outputStr, "Custom Book 1") || !strings.Contains(outputStr, "Custom Book 2") {
		t.Errorf("output should contain both custom books, got: %s", outputStr)
	}
}

func TestRunList_JSONOutput(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"lists": []map[string]interface{}{
							{"id": 1, "name": "Test List", "slug": "test-list", "description": "Test", "books_count": 1, "public": true, "list_books": []interface{}{}},
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	originalAPIKey := apiKey
	apiKey = "test-key"
	defer func() { apiKey = originalAPIKey }()

	originalOutputJSON := outputJSON
	outputJSON = true
	defer func() { outputJSON = originalOutputJSON }()

	// Capture output
	originalStdout := os.Stdout
	r, w, _ := os.Pipe()
	os.Stdout = w
	defer func() { os.Stdout = originalStdout }()

	// Create a test client with the mock server URL
	client := api.NewTestHardcoverClient("test-key", server.URL, server.Client())

	err := testRunList(client, []string{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	w.Close()
	var buf bytes.Buffer
	buf.ReadFrom(r)
	outputStr := buf.String()

	// Verify it's valid JSON
	var result []interface{}
	if err := json.Unmarshal([]byte(outputStr), &result); err != nil {
		t.Errorf("output should be valid JSON: %v", err)
	}
}
