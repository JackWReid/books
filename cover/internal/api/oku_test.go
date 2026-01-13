package api

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestOkuSearchBook(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req map[string]interface{}
		_ = json.NewDecoder(r.Body).Decode(&req)
		resp := map[string]interface{}{
			"books": []map[string]interface{}{
				{
					"id":            "1x1hN",
					"title":         "Pink Slime",
					"author":        "Fernanda Trías",
					"subtitle":      "A Novel",
					"publishedDate": "2024-07-02",
					"isbn10":        "1668049791",
					"isbn13":        "9781668049792",
					"description":   "<p>Longlisted for the NATIONAL BOOK AWARD for Translated Literature ...</p>",
					"descriptionMd": "Longlisted for the NATIONAL BOOK AWARD for Translated Literature ...",
					"pageCount":     240,
					"language":      "en",
					"imageLinks":    map[string]interface{}{"thumbnail": ""},
					"purchaseLinks": []interface{}{},
					"authors": []map[string]interface{}{
						{"id": 217897, "name": "Fernanda Trías", "image_url": "https://s.gr-assets.com/assets/nophoto/user/u_200x266-e183445fd1a1b5cc7075bb1cf7043306.png"},
					},
					"ratings":   []interface{}{},
					"thumbnail": "",
					"slug":      "pink-slime-by-fernanda-trías-1x1hN",
					"workId":    nil,
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &OkuClient{
		client:         server.Client(),
		baseURL:        "https://oku.club",
		searchEndpoint: server.URL,
	}

	book, err := client.SearchBook("Pink Slime")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title != "Pink Slime" || book.ID != "1x1hN" {
		t.Errorf("unexpected book: %+v", book)
	}
	if book.Author != "Fernanda Trías" {
		t.Errorf("unexpected author: got '%s'", book.Author)
	}
}

func TestOkuGetBookByISBN(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"books": []map[string]interface{}{
				{"id": "def456", "title": "ISBN Book", "author": "Author2", "isbn": "222", "description": "desc2", "url": ""},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &OkuClient{
		client:         server.Client(),
		baseURL:        "https://oku.club",
		searchEndpoint: server.URL,
	}

	book, err := client.GetBookByISBN("222")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title != "ISBN Book" || book.ID != "def456" {
		t.Errorf("unexpected book: %+v", book)
	}
}

func TestOkuGetBookURL(t *testing.T) {
	client := &OkuClient{baseURL: "https://oku.club"}
	url := client.GetBookURL("xyz789")
	expected := "https://oku.club/book/xyz789"
	if url != expected {
		t.Errorf("unexpected book URL: got %s, want %s", url, expected)
	}
}

func TestOkuSearchBookWithAuthor(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req map[string]interface{}
		json.NewDecoder(r.Body).Decode(&req)
		resp := map[string]interface{}{
			"books": []map[string]interface{}{
				{"id": "ghi789", "title": "Author Book", "author": "Author3", "isbn": "333", "description": "desc3", "url": ""},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &OkuClient{
		client:         server.Client(),
		baseURL:        "https://oku.club",
		searchEndpoint: server.URL,
	}

	book, err := client.SearchBookWithAuthor("Author Book", "Author3")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title != "Author Book" || book.ID != "ghi789" {
		t.Errorf("unexpected book: %+v", book)
	}
}

// Error/edge case tests
func TestOkuSearchBook_NotFound(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		resp := map[string]interface{}{
			"books": []map[string]interface{}{},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &OkuClient{
		client:         server.Client(),
		baseURL:        "https://oku.club",
		searchEndpoint: server.URL,
	}

	_, err := client.SearchBook("notfound")
	if err == nil {
		t.Error("expected error for not found book, got nil")
	}
}

func TestOkuSearchBook_MultipleResults(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var req map[string]interface{}
		_ = json.NewDecoder(r.Body).Decode(&req)
		resp := map[string]interface{}{
			"books": []map[string]interface{}{
				{
					"id":      "1x1hN",
					"title":   "Pink Slime",
					"author":  "Fernanda Trías",
					"authors": []map[string]interface{}{{"id": 217897, "name": "Fernanda Trías"}},
				},
				{
					"id":      "SUIr5",
					"title":   "Leadership",
					"author":  "Craig E. Johnson",
					"authors": []map[string]interface{}{{"id": 484144, "name": "Craig E. Johnson"}, {"id": 484143, "name": "Michael Z. Hackman"}},
				},
			},
		}
		json.NewEncoder(w).Encode(resp)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &OkuClient{
		client:         server.Client(),
		baseURL:        "https://oku.club",
		searchEndpoint: server.URL,
	}

	book, err := client.SearchBook("Pink Slime")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title != "Pink Slime" || book.ID != "1x1hN" {
		t.Errorf("unexpected book: %+v", book)
	}
	if book.Author != "Fernanda Trías" {
		t.Errorf("unexpected author: got '%s'", book.Author)
	}
}
