package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"cover/internal/models"
)

const (
	OkuSearchEndpoint = "https://oku.club/api/search/books"
	OkuBaseURL        = "https://oku.club"
	OkuTimeout        = 10 * time.Second
)

// OkuClient represents a client for the Oku API
type OkuClient struct {
	client         *http.Client
	baseURL        string
	searchEndpoint string
}

// NewOkuClient creates a new Oku API client
func NewOkuClient() *OkuClient {
	return &OkuClient{
		client: &http.Client{
			Timeout: OkuTimeout,
		},
		baseURL:        OkuBaseURL,
		searchEndpoint: OkuSearchEndpoint,
	}
}

// OkuSearchRequest represents the request payload for Oku search
type OkuSearchRequest struct {
	Query      string  `json:"query"`
	Author     *string `json:"author"`
	StartIndex int     `json:"startIndex"`
	MaxResults int     `json:"maxResults"`
	Lang       string  `json:"lang"`
}

// SearchBook searches for a book by title using the Oku API
func (c *OkuClient) SearchBook(title string) (*models.OkuBook, error) {
	request := OkuSearchRequest{
		Query:      title,
		Author:     nil,
		StartIndex: 0,
		MaxResults: 1,
		Lang:       "en",
	}

	jsonBody, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("marshal request failed: %w", err)
	}

	req, err := http.NewRequest("POST", c.searchEndpoint, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("execute request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Oku API request failed with status: %d", resp.StatusCode)
	}

	var response models.OkuSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("decode response failed: %w", err)
	}

	if len(response.Books) == 0 {
		return nil, fmt.Errorf("no books found for title: %s", title)
	}

	book := &response.Books[0]
	if book.Author == "" {
		// Fallback: decode into generic map to extract authors array
		var rawResp struct {
			Books []map[string]interface{} `json:"books"`
		}
		_ = json.NewDecoder(resp.Body).Decode(&rawResp)
		if len(rawResp.Books) > 0 {
			if authors, ok := rawResp.Books[0]["authors"]; ok {
				if arr, ok := authors.([]interface{}); ok && len(arr) > 0 {
					if authorMap, ok := arr[0].(map[string]interface{}); ok {
						if name, ok := authorMap["name"].(string); ok {
							book.Author = name
						}
					}
				}
			}
		}
	}

	// Use slug if available, otherwise fall back to ID
	if book.Slug != "" {
		book.URL = c.GetBookURLBySlug(book.Slug)
	} else {
		book.URL = c.GetBookURL(book.ID)
	}

	return book, nil
}

// GetBookByISBN searches for a book by ISBN using the Oku API
func (c *OkuClient) GetBookByISBN(isbn string) (*models.OkuBook, error) {
	// Oku API doesn't have direct ISBN search, so we'll search by ISBN as a query
	return c.SearchBook(isbn)
}

// GetBookURL constructs the Oku book URL from a book ID or slug
func (c *OkuClient) GetBookURL(bookID string) string {
	return fmt.Sprintf("%s/book/%s", c.baseURL, bookID)
}

// GetBookURLBySlug constructs the Oku book URL from a slug
func (c *OkuClient) GetBookURLBySlug(slug string) string {
	return fmt.Sprintf("%s/book/%s", c.baseURL, slug)
}

// SearchBookWithAuthor searches for a book by title and author
func (c *OkuClient) SearchBookWithAuthor(title, author string) (*models.OkuBook, error) {
	request := OkuSearchRequest{
		Query:      title,
		Author:     &author,
		StartIndex: 0,
		MaxResults: 1,
		Lang:       "en",
	}

	jsonBody, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("marshal request failed: %w", err)
	}

	req, err := http.NewRequest("POST", c.searchEndpoint, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("execute request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Oku API request failed with status: %d", resp.StatusCode)
	}

	var response models.OkuSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("decode response failed: %w", err)
	}

	if len(response.Books) == 0 {
		return nil, fmt.Errorf("no books found for title: %s by author: %s", title, author)
	}

	book := &response.Books[0]
	if book.Author == "" {
		// Fallback: decode into generic map to extract authors array
		var rawResp struct {
			Books []map[string]interface{} `json:"books"`
		}
		_ = json.NewDecoder(resp.Body).Decode(&rawResp)
		if len(rawResp.Books) > 0 {
			if authors, ok := rawResp.Books[0]["authors"]; ok {
				if arr, ok := authors.([]interface{}); ok && len(arr) > 0 {
					if authorMap, ok := arr[0].(map[string]interface{}); ok {
						if name, ok := authorMap["name"].(string); ok {
							book.Author = name
						}
					}
				}
			}
		}
	}

	// Use slug if available, otherwise fall back to ID
	if book.Slug != "" {
		book.URL = c.GetBookURLBySlug(book.Slug)
	} else {
		book.URL = c.GetBookURL(book.ID)
	}

	return book, nil
}
