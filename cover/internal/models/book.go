package models

import (
	"fmt"
	"time"
)

// Date represents a date in YYYY-MM-DD format
type Date struct {
	time.Time
}

// UnmarshalJSON implements json.Unmarshaler interface
func (d *Date) UnmarshalJSON(data []byte) error {
	// Strip quotes from the JSON string
	str := string(data)
	if len(str) >= 2 && str[0] == '"' && str[len(str)-1] == '"' {
		str = str[1 : len(str)-1]
	}

	// Try parsing as YYYY-MM-DD first
	t, err := time.Parse("2006-01-02", str)
	if err == nil {
		d.Time = t
		return nil
	}

	// If that fails, try RFC3339 (with or without nanoseconds)
	t, err = time.Parse(time.RFC3339Nano, str)
	if err == nil {
		d.Time = t
		return nil
	}
	t, err = time.Parse(time.RFC3339, str)
	if err == nil {
		d.Time = t
		return nil
	}

	return err
}

// MarshalJSON implements json.Marshaler interface
func (d Date) MarshalJSON() ([]byte, error) {
	return []byte(`"` + d.Time.Format("2006-01-02") + `"`), nil
}

// Image represents an image with metadata
type Image struct {
	ID        *int    `json:"id,omitempty"`
	URL       *string `json:"url,omitempty"`
	Color     *string `json:"color,omitempty"`
	ColorName *string `json:"color_name,omitempty"`
	Height    *int    `json:"height,omitempty"`
	Width     *int    `json:"width,omitempty"`
}

// Author represents an author with full details
type Author struct {
	ID    *int    `json:"id,omitempty"`
	Name  string  `json:"name"`
	Slug  *string `json:"slug,omitempty"`
	Image *Image  `json:"image,omitempty"`
}

// Contribution represents an author's contribution to a book
type Contribution struct {
	Author       Author  `json:"author"`
	Contribution *string `json:"contribution,omitempty"`
}

// Book represents a book in the Hardcover API (regular book type)
// Used for user_books, lists, and other standard book queries
type Book struct {
	ID              int            `json:"id"`
	Title           string         `json:"title"`
	Slug            string         `json:"slug"`
	Subtitle        *string        `json:"subtitle,omitempty"`
	Pages           *int           `json:"pages,omitempty"`
	Rating          *float64       `json:"rating,omitempty"`
	RatingsCount    *int           `json:"ratings_count,omitempty"`
	ReviewsCount    *int           `json:"reviews_count,omitempty"`
	ReleaseYear     *int           `json:"release_year,omitempty"`
	UsersCount      *int           `json:"users_count,omitempty"`
	UsersReadCount  *int           `json:"users_read_count,omitempty"`
	ListsCount      *int           `json:"lists_count,omitempty"`
	PromptsCount    *int           `json:"prompts_count,omitempty"`
	ActivitiesCount *int           `json:"activities_count,omitempty"`
	AudioSeconds    *int           `json:"audio_seconds,omitempty"`
	Image           *Image         `json:"image,omitempty"`
	Contributions   []Contribution `json:"contributions,omitempty"`
}

// SearchBook represents a book from the search API
// This has a different structure with more fields and different field names
type SearchBook struct {
	ID                string         `json:"id"` // Search returns ID as string
	Title             string         `json:"title"`
	Slug              string         `json:"slug"`
	AlternativeTitles []string       `json:"alternative_titles,omitempty"`
	AuthorNames       []string       `json:"author_names,omitempty"`
	Compilation       bool           `json:"compilation"`
	ContentWarnings   []string       `json:"content_warnings,omitempty"`
	ContributionTypes []string       `json:"contribution_types,omitempty"`
	Contributions     []Contribution `json:"contributions,omitempty"`
	CoverColor        *string        `json:"cover_color,omitempty"`
	Description       *string        `json:"description,omitempty"`
	FeaturedSeries    interface{}    `json:"featured_series,omitempty"`
	Genres            []string       `json:"genres,omitempty"`
	HasAudiobook      bool           `json:"has_audiobook"`
	HasEbook          bool           `json:"has_ebook"`
	Image             *Image         `json:"image,omitempty"`
	ISBNs             []string       `json:"isbns,omitempty"`
	ListsCount        int            `json:"lists_count"`
	Moods             []string       `json:"moods,omitempty"`
	Pages             *int           `json:"pages,omitempty"`
	PromptsCount      int            `json:"prompts_count"`
	Rating            float64        `json:"rating"`
	RatingsCount      int            `json:"ratings_count"`
	ReleaseDate       *string        `json:"release_date,omitempty"`
	ReleaseYear       *int           `json:"release_year,omitempty"`
	ReviewsCount      int            `json:"reviews_count"`
	SeriesNames       []string       `json:"series_names,omitempty"`
	Tags              []string       `json:"tags,omitempty"`
	UsersCount        int            `json:"users_count"`
	UsersReadCount    int            `json:"users_read_count"`
	ActivitiesCount   int            `json:"activities_count"`
}

// UserBook represents a user's relationship with a book
type UserBook struct {
	ID        int      `json:"id"`
	StatusID  int      `json:"status_id"`
	Rating    *float64 `json:"rating"`
	ReviewRaw *string  `json:"review_raw"`
	DateAdded Date     `json:"date_added"`
	Book      Book     `json:"book"`
}

// List represents a user's book list
type List struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description"`
	BooksCount  int        `json:"books_count"`
	Public      bool       `json:"public"`
	ListBooks   []ListBook `json:"list_books"`
}

// ListBook represents a book in a list
type ListBook struct {
	Book      Book `json:"book"`
	Position  int  `json:"position"`
	DateAdded Date `json:"date_added"`
}

// SearchHit represents a single search result hit
type SearchHit struct {
	Document      SearchBook  `json:"document"`
	Highlight     interface{} `json:"highlight,omitempty"`
	Highlights    interface{} `json:"highlights,omitempty"`
	TextMatch     interface{} `json:"text_match,omitempty"`
	TextMatchInfo interface{} `json:"text_match_info,omitempty"`
}

// SearchResults represents the raw search results from Typesense
type SearchResults struct {
	FacetCounts   []interface{} `json:"facet_counts"`
	Found         int           `json:"found"`
	Hits          []SearchHit   `json:"hits"`
	OutOf         int           `json:"out_of"`
	Page          int           `json:"page"`
	RequestParams interface{}   `json:"request_params"`
	SearchCutoff  bool          `json:"search_cutoff"`
	SearchTimeMs  int           `json:"search_time_ms"`
}

// SearchResponse represents the response from the search API
type SearchResponse struct {
	Results   SearchResults `json:"results"`
	IDs       []string      `json:"ids"` // IDs as strings from the API
	Query     string        `json:"query"`
	QueryType string        `json:"query_type"`
	Page      int           `json:"page"`
	PerPage   int           `json:"per_page"`
}

// GraphQLResponse represents a generic GraphQL response
type GraphQLResponse struct {
	Data   interface{}    `json:"data"`
	Errors []GraphQLError `json:"errors,omitempty"`
}

// GraphQLError represents a GraphQL error
type GraphQLError struct {
	Message    string                 `json:"message"`
	Locations  []GraphQLLocation      `json:"locations,omitempty"`
	Path       []string               `json:"path,omitempty"`
	Extensions map[string]interface{} `json:"extensions,omitempty"`
}

// GraphQLLocation represents the location of a GraphQL error
type GraphQLLocation struct {
	Line   int `json:"line"`
	Column int `json:"column"`
}

// OkuBook represents book data from the Oku API
type OkuBook struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	ISBN        string `json:"isbn"`
	Description string `json:"description"`
	URL         string `json:"url"`
	Slug        string `json:"slug"`
}

// OkuSearchResponse represents the response from Oku search API
type OkuSearchResponse struct {
	Books []OkuBook `json:"books"`
}

// GoodreadsBook represents book data from Goodreads
type GoodreadsBook struct {
	Title  string `json:"title"`
	Author string `json:"author"`
	URL    string `json:"url"`
}

// SearchResult represents a unified search result
type SearchResult struct {
	Book         Book
	HardcoverURL string
	GoodreadsURL string
	OkuURL       string
}

// BlogBook represents the simplified book format used in blog-to-read.json
type BlogBook struct {
	DateUpdated  string  `json:"date_updated"`
	Title        string  `json:"title"`
	Author       string  `json:"author"`
	ImageURL     *string `json:"image_url,omitempty"`
	HardcoverURL string  `json:"hardcover_url"`
}

// ToBlogBook converts a UserBook to BlogBook format
func (ub *UserBook) ToBlogBook() *BlogBook {
	// Get the first author name from contributions
	author := "Unknown"
	if len(ub.Book.Contributions) > 0 {
		author = ub.Book.Contributions[0].Author.Name
	}

	// Get image URL if available
	var imageURL *string
	if ub.Book.Image != nil && ub.Book.Image.URL != nil {
		imageURL = ub.Book.Image.URL
	}

	// Construct Hardcover URL from book slug
	hardcoverURL := fmt.Sprintf("https://hardcover.app/books/%s", ub.Book.Slug)

	return &BlogBook{
		DateUpdated:  ub.DateAdded.Format("2006-01-02"), // Use date_added as date_updated
		Title:        ub.Book.Title,
		Author:       author,
		ImageURL:     imageURL,
		HardcoverURL: hardcoverURL,
	}
}

// ToBlogBooks converts a slice of UserBooks to BlogBooks
func ToBlogBooks(userBooks []UserBook) []BlogBook {
	blogBooks := make([]BlogBook, len(userBooks))
	for i, ub := range userBooks {
		blogBook := ub.ToBlogBook()
		blogBooks[i] = *blogBook
	}
	return blogBooks
}

// User represents a user in the Hardcover API
type User struct {
	ID                 int     `json:"id"`
	Username           string  `json:"username"`
	Birthdate          *string `json:"birthdate,omitempty"`
	BooksCount         int     `json:"books_count"`
	Flair              *string `json:"flair,omitempty"`
	FollowersCount     int     `json:"followers_count"`
	FollowedUsersCount int     `json:"followed_users_count"`
	Location           *string `json:"location,omitempty"`
	Name               *string `json:"name,omitempty"`
	Pro                bool    `json:"pro"`
	PronounPersonal    string  `json:"pronoun_personal"`
	PronounPossessive  string  `json:"pronoun_possessive"`
	SignInCount        int     `json:"sign_in_count"`
}
