package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"

	"cover/internal/models"
)

const (
	HardcoverGraphQLEndpoint = "https://api.hardcover.app/v1/graphql"
	DefaultTimeout           = 30 * time.Second
)

// HardcoverClient represents a client for the Hardcover GraphQL API
type HardcoverClient struct {
	client  *http.Client
	apiKey  string
	baseURL string
}

// NewHardcoverClient creates a new Hardcover API client
func NewHardcoverClient(apiKey string) *HardcoverClient {
	return &HardcoverClient{
		client: &http.Client{
			Timeout: DefaultTimeout,
		},
		apiKey:  apiKey,
		baseURL: HardcoverGraphQLEndpoint,
	}
}

// NewTestHardcoverClient creates a new Hardcover API client for testing with a custom base URL
func NewTestHardcoverClient(apiKey, baseURL string, client *http.Client) *HardcoverClient {
	if client == nil {
		client = &http.Client{
			Timeout: DefaultTimeout,
		}
	}
	return &HardcoverClient{
		client:  client,
		apiKey:  apiKey,
		baseURL: baseURL,
	}
}

// SearchBooks searches for books using the Hardcover search API
func (c *HardcoverClient) SearchBooks(query, queryType string, perPage, page int, sort string) (*models.SearchResponse, error) {
	if sort == "" {
		sort = "activities_count:desc"
	}

	graphqlQuery := `
		query Search($query: String!, $queryType: String!, $perPage: Int!, $page: Int!, $sort: String) {
			search(query: $query, query_type: $queryType, per_page: $perPage, page: $page, sort: $sort) {
				results
				ids
				query
				query_type
				page
				per_page
			}
		}
	`

	variables := map[string]interface{}{
		"query":     query,
		"queryType": queryType,
		"perPage":   perPage,
		"page":      page,
		"sort":      sort,
	}

	var response struct {
		Data struct {
			Search models.SearchResponse `json:"search"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, variables, &response)
	if err != nil {
		return nil, fmt.Errorf("search books failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	return &response.Data.Search, nil
}

// AddBookToList adds a book to a list using the insert_list_book mutation
func (c *HardcoverClient) AddBookToList(bookID, listID int) error {
	graphqlQuery := `
		mutation AddBookToList($bookId: Int!, $listId: Int!) {
			insert_list_book(object: {book_id: $bookId, list_id: $listId}) {
				id
				list_id
				book_id
				date_added
			}
		}
	`

	variables := map[string]interface{}{
		"bookId": bookID,
		"listId": listID,
	}

	var response struct {
		Data struct {
			InsertListBook struct {
				ID        int       `json:"id"`
				ListID    int       `json:"list_id"`
				BookID    int       `json:"book_id"`
				DateAdded time.Time `json:"date_added"`
			} `json:"insert_list_book"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, variables, &response)
	if err != nil {
		return fmt.Errorf("add book to list failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	return nil
}

// GetUserBooks gets user's books by status, sorted in reverse chronological order by date_added
func (c *HardcoverClient) GetUserBooks(statusID int) ([]models.UserBook, error) {
	graphqlQuery := `
		query GetUserBooks($statusId: Int!) {
			me {
				user_books(where: {status_id: {_eq: $statusId}}, order_by: {date_added: desc}) {
					id
					status_id
					rating
					review_raw
					date_added
					book {
						id
						title
						slug
						subtitle
						contributions {
							author {
								name
							}
						}
						image {
							url
						}
					}
				}
			}
		}
	`

	variables := map[string]interface{}{
		"statusId": statusID,
	}

	var response struct {
		Data struct {
			Me []struct {
				UserBooks []models.UserBook `json:"user_books"`
			} `json:"me"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, variables, &response)
	if err != nil {
		return nil, fmt.Errorf("get user books failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	// Handle the case where me is an array
	if len(response.Data.Me) > 0 {
		return response.Data.Me[0].UserBooks, nil
	}

	return []models.UserBook{}, nil
}

// GetUserLists gets all user lists
func (c *HardcoverClient) GetUserLists() ([]models.List, error) {
	graphqlQuery := `
		query GetUserLists {
			me {
				lists(order_by: {created_at: desc}) {
					id
					name
					slug
					list_books {
						date_added
						book {
							id
							slug
							title
							contributions {
								author {
									name
								}
							}
							subtitle
							image {
								url
							}
						}
					}
				}
			}
		}
	`

	var response struct {
		Data struct {
			Me []struct {
				Lists []models.List `json:"lists"`
			} `json:"me"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, nil, &response)
	if err != nil {
		return nil, fmt.Errorf("get user lists failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	// Handle the case where me is an array
	if len(response.Data.Me) > 0 {
		return response.Data.Me[0].Lists, nil
	}

	return []models.List{}, nil
}

// GetListBooks gets books in a specific list
func (c *HardcoverClient) GetListBooks(listID int) (*models.List, error) {
	graphqlQuery := `
		query GetListBooks($listId: Int!) {
			lists_by_pk(id: $listId) {
				id
				name
				slug
				description
				books_count
				public
				list_books(order_by: {position: asc}) {
					book {
						id
						title
						slug
						subtitle
						contributions {
							author {
								name
							}
						}
						image {
							url
						}
					}
					position
					date_added
				}
			}
		}
	`

	variables := map[string]interface{}{
		"listId": listID,
	}

	var response struct {
		Data struct {
			ListsByPk *models.List `json:"lists_by_pk"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, variables, &response)
	if err != nil {
		return nil, fmt.Errorf("get list books failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	if response.Data.ListsByPk == nil {
		return nil, fmt.Errorf("list not found with ID: %d", listID)
	}

	return response.Data.ListsByPk, nil
}

// GetUserInfo gets the current user's information
func (c *HardcoverClient) GetUserInfo() (*models.User, error) {
	graphqlQuery := `
		query GetUserInfo {
			me {
				id
				username
				birthdate
				books_count
				flair
				followers_count
				followed_users_count
				location
				name
				pro
				pronoun_personal
				pronoun_possessive
				sign_in_count
			}
		}
	`

	var response struct {
		Data struct {
			Me []models.User `json:"me"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, nil, &response)
	if err != nil {
		return nil, fmt.Errorf("get user info failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return nil, fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	if len(response.Data.Me) > 0 {
		return &response.Data.Me[0], nil
	}

	return nil, fmt.Errorf("no user data found")
}

// executeGraphQL executes a GraphQL query
func (c *HardcoverClient) executeGraphQL(query string, variables map[string]interface{}, result interface{}) error {
	requestBody := map[string]interface{}{
		"query":     query,
		"variables": variables,
	}

	jsonBody, err := json.Marshal(requestBody)
	if err != nil {
		return fmt.Errorf("marshal request body failed: %w", err)
	}

	req, err := http.NewRequest("POST", c.baseURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return fmt.Errorf("create request failed: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	headerValue := c.apiKey
	if !strings.HasPrefix(headerValue, "Bearer ") {
		headerValue = "Bearer " + headerValue
	}
	req.Header.Set("Authorization", headerValue)

	resp, err := c.client.Do(req)
	if err != nil {
		return fmt.Errorf("execute request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("API request failed with status: %d", resp.StatusCode)
	}

	// Read and log the raw response body
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}

	// Now decode from bytes
	if err := json.Unmarshal(bodyBytes, result); err != nil {
		return fmt.Errorf("decode response failed: %w", err)
	}

	return nil
}

// ParseSearchResults extracts book information from the search results
func (c *HardcoverClient) ParseSearchResults(searchResp *models.SearchResponse) ([]models.SearchBook, error) {
	if searchResp.Results.Found == 0 {
		return []models.SearchBook{}, nil
	}

	var books []models.SearchBook
	for _, hit := range searchResp.Results.Hits {
		var book models.SearchBook
		if err := json.Unmarshal(hit.Document, &book); err != nil {
			return nil, fmt.Errorf("decode search hit failed: %w", err)
		}
		books = append(books, book)
	}

	return books, nil
}

// ConvertSearchBookToBook converts a SearchBook to a regular Book
func (c *HardcoverClient) ConvertSearchBookToBook(searchBook models.SearchBook) (*models.Book, error) {
	// Convert string ID to int
	id, err := strconv.Atoi(searchBook.ID)
	if err != nil {
		return nil, fmt.Errorf("invalid book ID: %s", searchBook.ID)
	}

	// Convert float64 rating to *float64
	var rating *float64
	if searchBook.Rating != 0 {
		rating = &searchBook.Rating
	}

	// Convert int fields to *int
	var pages *int
	if searchBook.Pages != nil {
		pages = searchBook.Pages
	}

	var releaseYear *int
	if searchBook.ReleaseYear != nil {
		releaseYear = searchBook.ReleaseYear
	}

	// Convert int fields to *int for optional fields
	ratingsCount := &searchBook.RatingsCount
	reviewsCount := &searchBook.ReviewsCount
	usersCount := &searchBook.UsersCount
	usersReadCount := &searchBook.UsersReadCount
	listsCount := &searchBook.ListsCount
	promptsCount := &searchBook.PromptsCount
	activitiesCount := &searchBook.ActivitiesCount

	return &models.Book{
		ID:              id,
		Title:           searchBook.Title,
		Slug:            searchBook.Slug,
		Pages:           pages,
		Rating:          rating,
		RatingsCount:    ratingsCount,
		ReviewsCount:    reviewsCount,
		ReleaseYear:     releaseYear,
		UsersCount:      usersCount,
		UsersReadCount:  usersReadCount,
		ListsCount:      listsCount,
		PromptsCount:    promptsCount,
		ActivitiesCount: activitiesCount,
		Image:           searchBook.Image,
		Contributions:   searchBook.Contributions,
	}, nil
}

// GetBookByISBN searches for a book by ISBN using the search API
func (c *HardcoverClient) GetBookByISBN(isbn string) (*models.Book, error) {
	searchResp, err := c.SearchBooks(isbn, "books", 1, 1, "")
	if err != nil {
		return nil, err
	}
	searchBooks, err := c.ParseSearchResults(searchResp)
	if err != nil {
		return nil, err
	}
	if len(searchBooks) == 0 {
		return nil, fmt.Errorf("no books found for ISBN: %s", isbn)
	}
	book, err := c.ConvertSearchBookToBook(searchBooks[0])
	if err != nil {
		return nil, err
	}
	return book, nil
}

// AddBookToLibrary adds a book to the user's library with a specific status
func (c *HardcoverClient) AddBookToLibrary(bookID, statusID int) error {
	graphqlQuery := `
		mutation AddBookToLibrary($bookId: Int!, $statusId: Int!) {
			insert_user_book(object: {book_id: $bookId, status_id: $statusId}) {
				id
			}
		}
	`

	variables := map[string]interface{}{
		"bookId":   bookID,
		"statusId": statusID,
	}

	var response struct {
		Data struct {
			InsertUserBook struct {
				ID int `json:"id"`
			} `json:"insert_user_book"`
		} `json:"data"`
		Errors []models.GraphQLError `json:"errors,omitempty"`
	}

	err := c.executeGraphQL(graphqlQuery, variables, &response)
	if err != nil {
		return fmt.Errorf("add book to library failed: %w", err)
	}

	if len(response.Errors) > 0 {
		return fmt.Errorf("GraphQL errors: %v", response.Errors)
	}

	return nil
}
