package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"cover/internal/models"
)

func TestSearchBooks(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 1,
						"hits": []map[string]interface{}{
							{
								"document": map[string]interface{}{
									"id":               "123",
									"title":            "Test Book",
									"slug":             "test-book",
									"author_names":     []string{"Test Author"},
									"rating":           4.5,
									"ratings_count":    100,
									"reviews_count":    25,
									"users_count":      500,
									"users_read_count": 200,
									"lists_count":      10,
									"prompts_count":    5,
									"activities_count": 15,
									"compilation":      false,
									"has_audiobook":    false,
									"has_ebook":        false,
									"contributions":    []interface{}{},
								},
							},
						},
						"out_of": 1000,
						"page":   1,
					},
					"ids":        []string{"123"},
					"query":      "test",
					"query_type": "books",
					"page":       1,
					"per_page":   10,
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	resp, err := client.SearchBooks("Test", "book", 1, 1, "")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	// Parse the results to test the actual functionality
	books, err := client.ParseSearchResults(resp)
	if err != nil {
		t.Fatalf("failed to parse search results: %v", err)
	}

	if len(books) != 1 || books[0].Title != "Test Book" {
		t.Errorf("unexpected search result: %+v", books)
	}
}

func TestAddBookToList(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"insert_list_book": map[string]interface{}{
					"id": 10, "list_id": 5, "book_id": 2, "date_added": time.Now().Format(time.RFC3339),
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	err := client.AddBookToList(2, 5)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}

func TestGetUserBooks(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"user_books": []map[string]interface{}{
							{
								"id":         1,
								"status_id":  2,
								"rating":     nil,
								"review_raw": nil,
								"date_added": "2023-01-15",
								"book": map[string]interface{}{
									"id":       1,
									"title":    "User Book",
									"slug":     "user-book",
									"subtitle": nil,
									"contributions": []map[string]interface{}{
										{
											"author": map[string]interface{}{
												"name": "Test Author",
											},
										},
									},
									"image": map[string]interface{}{
										"url": "https://example.com/image.jpg",
									},
								},
							},
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	books, err := client.GetUserBooks(2)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(books) != 1 || books[0].Book.Title != "User Book" {
		t.Errorf("unexpected user books: %+v", books)
	}
}

func TestGetUserLists(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"lists": []map[string]interface{}{
							{
								"id":         1,
								"name":       "List1",
								"slug":       "list1",
								"list_books": []interface{}{},
							},
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	lists, err := client.GetUserLists()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(lists) != 1 || lists[0].Name != "List1" {
		t.Errorf("unexpected lists: %+v", lists)
	}
}

func TestGetListBooks(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"lists_by_pk": map[string]interface{}{
					"id":          1,
					"name":        "List1",
					"slug":        "list1",
					"description": "desc",
					"books_count": 2,
					"public":      true,
					"list_books": []map[string]interface{}{
						{
							"book": map[string]interface{}{
								"id":       1,
								"title":    "Book1",
								"slug":     "book1",
								"subtitle": nil,
								"contributions": []map[string]interface{}{
									{
										"author": map[string]interface{}{
											"name": "Test Author",
										},
									},
								},
								"image": map[string]interface{}{
									"url": "https://example.com/image.jpg",
								},
							},
							"position":   1,
							"date_added": "2023-01-15",
						},
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	list, err := client.GetListBooks(1)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if list.Name != "List1" || len(list.ListBooks) != 1 {
		t.Errorf("unexpected list books: %+v", list)
	}
}

func TestGetUserInfo(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"me": []map[string]interface{}{
					{
						"id":                   123,
						"username":             "testuser",
						"birthdate":            nil,
						"books_count":          50,
						"flair":                nil,
						"followers_count":      10,
						"followed_users_count": 5,
						"location":             "Test City",
						"name":                 "Test User",
						"pro":                  false,
						"pronoun_personal":     "they",
						"pronoun_possessive":   "their",
						"sign_in_count":        25,
					},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	user, err := client.GetUserInfo()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if user.Username != "testuser" || user.BooksCount != 50 {
		t.Errorf("unexpected user info: %+v", user)
	}
}

func TestConvertSearchBookToBook(t *testing.T) {
	client := &HardcoverClient{}

	searchBook := models.SearchBook{
		ID:              "123",
		Title:           "Test Book",
		Slug:            "test-book",
		Rating:          4.5,
		RatingsCount:    100,
		ReviewsCount:    25,
		UsersCount:      500,
		UsersReadCount:  200,
		ListsCount:      10,
		PromptsCount:    5,
		ActivitiesCount: 15,
		Pages:           intPtr(300),
		ReleaseYear:     intPtr(2023),
		Image: &models.Image{
			URL: stringPtr("https://example.com/image.jpg"),
		},
		Contributions: []models.Contribution{
			{
				Author: models.Author{
					Name: "Test Author",
				},
			},
		},
	}

	book, err := client.ConvertSearchBookToBook(searchBook)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if book.ID != 123 || book.Title != "Test Book" || book.Slug != "test-book" {
		t.Errorf("unexpected converted book: %+v", book)
	}

	if book.Rating == nil || *book.Rating != 4.5 {
		t.Errorf("unexpected rating: %v", book.Rating)
	}

	if book.Pages == nil || *book.Pages != 300 {
		t.Errorf("unexpected pages: %v", book.Pages)
	}

	if book.ReleaseYear == nil || *book.ReleaseYear != 2023 {
		t.Errorf("unexpected release year: %v", book.ReleaseYear)
	}
}

func TestGetBookByISBN(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found": 1,
						"hits": []map[string]interface{}{
							{
								"document": map[string]interface{}{
									"id":               "123",
									"title":            "Test Book",
									"slug":             "test-book",
									"author_names":     []string{"Test Author"},
									"rating":           4.5,
									"ratings_count":    100,
									"reviews_count":    25,
									"users_count":      500,
									"users_read_count": 200,
									"lists_count":      10,
									"prompts_count":    5,
									"activities_count": 15,
									"compilation":      false,
									"has_audiobook":    false,
									"has_ebook":        false,
									"contributions":    []interface{}{},
								},
							},
						},
						"out_of": 1000,
						"page":   1,
					},
					"ids":        []string{"123"},
					"query":      "9781668049778",
					"query_type": "books",
					"page":       1,
					"per_page":   1,
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	book, err := client.GetBookByISBN("9781668049778")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title != "Test Book" || book.ID != 123 {
		t.Errorf("unexpected book: %+v", book)
	}
}

func TestGetBookByISBN_NotFound(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"data": map[string]interface{}{
				"search": map[string]interface{}{
					"results": map[string]interface{}{
						"found":  0,
						"hits":   []interface{}{},
						"out_of": 1000,
						"page":   1,
					},
					"ids":        []string{},
					"query":      "notfound",
					"query_type": "books",
					"page":       1,
					"per_page":   1,
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &HardcoverClient{
		client:  server.Client(),
		apiKey:  "test",
		baseURL: server.URL,
	}

	_, err := client.GetBookByISBN("notfound")
	if err == nil {
		t.Error("expected error for not found book, got nil")
	}
}

// Helper functions for creating pointers
func stringPtr(s string) *string {
	return &s
}

func intPtr(i int) *int {
	return &i
}
