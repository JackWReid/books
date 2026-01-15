package models

import (
	"encoding/json"
	"reflect"
	"testing"
	"time"
)

func TestDateMarshalUnmarshal(t *testing.T) {
	date := Date{time.Date(2023, 1, 15, 0, 0, 0, 0, time.UTC)}
	data, err := json.Marshal(date)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	expected := `"2023-01-15"`
	if string(data) != expected {
		t.Errorf("expected %s, got %s", expected, string(data))
	}

	var out Date
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}
	if !date.Time.Equal(out.Time) {
		t.Errorf("expected %v, got %v", date.Time, out.Time)
	}
}

func TestBookMarshalUnmarshal(t *testing.T) {
	book := Book{
		ID:       1,
		Title:    "Test Book",
		Slug:     "test-book",
		Subtitle: stringPtr("A Test Subtitle"),
		Pages:    intPtr(300),
		Rating:   float64Ptr(4.5),
		Image: &Image{
			URL: stringPtr("https://example.com/image.jpg"),
		},
		Contributions: []Contribution{
			{
				Author: Author{
					Name: "Test Author",
					Slug: stringPtr("test-author"),
				},
			},
		},
	}

	data, err := json.Marshal(book)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out Book
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(book, out) {
		t.Errorf("expected %+v, got %+v", book, out)
	}
}

func TestSearchBookMarshalUnmarshal(t *testing.T) {
	searchBook := SearchBook{
		ID:                "123",
		Title:             "Search Test Book",
		Slug:              "search-test-book",
		AlternativeTitles: []string{"Alt Title 1", "Alt Title 2"},
		AuthorNames:       []string{"Author 1", "Author 2"},
		Compilation:       false,
		ContentWarnings:   []string{"Warning 1"},
		ContributionTypes: []string{"Author"},
		CoverColor:        stringPtr("Blue"),
		Description:       stringPtr("A test description"),
		Genres:            []string{"Fiction", "Science Fiction"},
		HasAudiobook:      true,
		HasEbook:          false,
		ISBNs:             []string{"9781234567890"},
		ListsCount:        10,
		Moods:             []string{"Dark"},
		Pages:             intPtr(400),
		PromptsCount:      5,
		Rating:            4.2,
		RatingsCount:      100,
		ReleaseDate:       stringPtr("2023-01-15"),
		ReleaseYear:       intPtr(2023),
		ReviewsCount:      25,
		SeriesNames:       []string{"Test Series"},
		Tags:              []string{"Tag1", "Tag2"},
		UsersCount:        500,
		UsersReadCount:    200,
		ActivitiesCount:   15,
		Image: &Image{
			ID:        intPtr(123),
			URL:       stringPtr("https://example.com/search-image.jpg"),
			Color:     stringPtr("#ff0000"),
			ColorName: stringPtr("Red"),
			Height:    intPtr(300),
			Width:     intPtr(200),
		},
		Contributions: []Contribution{
			{
				Author: Author{
					ID:    intPtr(456),
					Name:  "Search Author",
					Slug:  stringPtr("search-author"),
					Image: &Image{URL: stringPtr("https://example.com/author.jpg")},
				},
				Contribution: stringPtr("Author"),
			},
		},
	}

	data, err := json.Marshal(searchBook)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out SearchBook
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(searchBook, out) {
		t.Errorf("expected %+v, got %+v", searchBook, out)
	}
}

func TestImageMarshalUnmarshal(t *testing.T) {
	image := Image{
		ID:        intPtr(123),
		URL:       stringPtr("https://example.com/image.jpg"),
		Color:     stringPtr("#ff0000"),
		ColorName: stringPtr("Red"),
		Height:    intPtr(300),
		Width:     intPtr(200),
	}

	data, err := json.Marshal(image)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out Image
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(image, out) {
		t.Errorf("expected %+v, got %+v", image, out)
	}
}

func TestAuthorMarshalUnmarshal(t *testing.T) {
	author := Author{
		ID:    intPtr(456),
		Name:  "Test Author",
		Slug:  stringPtr("test-author"),
		Image: &Image{URL: stringPtr("https://example.com/author.jpg")},
	}

	data, err := json.Marshal(author)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out Author
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(author, out) {
		t.Errorf("expected %+v, got %+v", author, out)
	}
}

func TestContributionMarshalUnmarshal(t *testing.T) {
	contribution := Contribution{
		Author: Author{
			ID:   intPtr(456),
			Name: "Test Author",
			Slug: stringPtr("test-author"),
		},
		Contribution: stringPtr("Author"),
	}

	data, err := json.Marshal(contribution)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out Contribution
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(contribution, out) {
		t.Errorf("expected %+v, got %+v", contribution, out)
	}
}

func TestSearchResponseMarshalUnmarshal(t *testing.T) {
	searchResponse := SearchResponse{
		Results: SearchResults{
			Found: 2,
			Hits: []SearchHit{
				{
					Document: mustMarshalSearchDoc(t, SearchBook{
						ID:    "123",
						Title: "Test Book 1",
						Slug:  "test-book-1",
					}),
				},
				{
					Document: mustMarshalSearchDoc(t, SearchBook{
						ID:    "456",
						Title: "Test Book 2",
						Slug:  "test-book-2",
					}),
				},
			},
			OutOf: 1000,
			Page:  1,
		},
		IDs:       []string{"123", "456"},
		Query:     "test",
		QueryType: "books",
		Page:      1,
		PerPage:   10,
	}

	data, err := json.Marshal(searchResponse)
	if err != nil {
		t.Fatalf("marshal failed: %v", err)
	}

	var out SearchResponse
	if err := json.Unmarshal(data, &out); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if !reflect.DeepEqual(searchResponse, out) {
		t.Errorf("expected %+v, got %+v", searchResponse, out)
	}
}

func mustMarshalSearchDoc(t *testing.T, doc SearchBook) json.RawMessage {
	t.Helper()
	data, err := json.Marshal(doc)
	if err != nil {
		t.Fatalf("marshal search document failed: %v", err)
	}
	return data
}

func TestUserBookToBlogBook(t *testing.T) {
	// Create a test UserBook
	userBook := UserBook{
		ID:        123,
		StatusID:  3,
		Rating:    float64Ptr(4.5),
		DateAdded: Date{time.Date(2025, 6, 17, 0, 0, 0, 0, time.UTC)},
		Book: Book{
			ID:    456,
			Title: "The Test Book",
			Slug:  "the-test-book",
			Image: &Image{
				URL: stringPtr("https://example.com/cover.jpg"),
			},
			Contributions: []Contribution{
				{
					Author: Author{
						Name: "Test Author",
					},
				},
			},
		},
	}

	// Convert to BlogBook
	blogBook := userBook.ToBlogBook()

	// Verify the transformation
	expected := &BlogBook{
		DateUpdated:  "2025-06-17",
		Title:        "The Test Book",
		Author:       "Test Author",
		ImageURL:     stringPtr("https://example.com/cover.jpg"),
		HardcoverURL: "https://hardcover.app/books/the-test-book",
	}

	if !reflect.DeepEqual(blogBook, expected) {
		t.Errorf("ToBlogBook() = %+v, expected %+v", blogBook, expected)
	}
}

func TestUserBookToBlogBookNoImage(t *testing.T) {
	// Create a test UserBook without image
	userBook := UserBook{
		ID:        123,
		StatusID:  1,
		DateAdded: Date{time.Date(2025, 5, 25, 0, 0, 0, 0, time.UTC)},
		Book: Book{
			ID:    789,
			Title: "Book Without Image",
			Slug:  "book-without-image",
			Contributions: []Contribution{
				{
					Author: Author{
						Name: "Another Author",
					},
				},
			},
		},
	}

	// Convert to BlogBook
	blogBook := userBook.ToBlogBook()

	// Verify the transformation
	expected := &BlogBook{
		DateUpdated:  "2025-05-25",
		Title:        "Book Without Image",
		Author:       "Another Author",
		ImageURL:     nil,
		HardcoverURL: "https://hardcover.app/books/book-without-image",
	}

	if !reflect.DeepEqual(blogBook, expected) {
		t.Errorf("ToBlogBook() = %+v, expected %+v", blogBook, expected)
	}
}

func TestUserBookToBlogBookNoAuthor(t *testing.T) {
	// Create a test UserBook without author contributions
	userBook := UserBook{
		ID:        123,
		StatusID:  2,
		DateAdded: Date{time.Date(2025, 6, 1, 0, 0, 0, 0, time.UTC)},
		Book: Book{
			ID:    999,
			Title: "Book Without Author",
			Slug:  "book-without-author",
			Image: &Image{
				URL: stringPtr("https://example.com/cover2.jpg"),
			},
			Contributions: []Contribution{}, // Empty contributions
		},
	}

	// Convert to BlogBook
	blogBook := userBook.ToBlogBook()

	// Verify the transformation
	expected := &BlogBook{
		DateUpdated:  "2025-06-01",
		Title:        "Book Without Author",
		Author:       "Unknown",
		ImageURL:     stringPtr("https://example.com/cover2.jpg"),
		HardcoverURL: "https://hardcover.app/books/book-without-author",
	}

	if !reflect.DeepEqual(blogBook, expected) {
		t.Errorf("ToBlogBook() = %+v, expected %+v", blogBook, expected)
	}
}

func TestToBlogBooks(t *testing.T) {
	// Create test UserBooks
	userBooks := []UserBook{
		{
			ID:        1,
			StatusID:  3,
			DateAdded: Date{time.Date(2025, 6, 17, 0, 0, 0, 0, time.UTC)},
			Book: Book{
				ID:    100,
				Title: "First Book",
				Slug:  "first-book",
				Image: &Image{
					URL: stringPtr("https://example.com/first.jpg"),
				},
				Contributions: []Contribution{
					{
						Author: Author{
							Name: "First Author",
						},
					},
				},
			},
		},
		{
			ID:        2,
			StatusID:  1,
			DateAdded: Date{time.Date(2025, 5, 25, 0, 0, 0, 0, time.UTC)},
			Book: Book{
				ID:    200,
				Title: "Second Book",
				Slug:  "second-book",
				Contributions: []Contribution{
					{
						Author: Author{
							Name: "Second Author",
						},
					},
				},
			},
		},
	}

	// Convert to BlogBooks
	blogBooks := ToBlogBooks(userBooks)

	// Verify the transformation
	expected := []BlogBook{
		{
			DateUpdated:  "2025-06-17",
			Title:        "First Book",
			Author:       "First Author",
			ImageURL:     stringPtr("https://example.com/first.jpg"),
			HardcoverURL: "https://hardcover.app/books/first-book",
		},
		{
			DateUpdated:  "2025-05-25",
			Title:        "Second Book",
			Author:       "Second Author",
			ImageURL:     nil,
			HardcoverURL: "https://hardcover.app/books/second-book",
		},
	}

	if !reflect.DeepEqual(blogBooks, expected) {
		t.Errorf("ToBlogBooks() = %+v, expected %+v", blogBooks, expected)
	}
}

func TestToBlogBooksEmpty(t *testing.T) {
	// Test with empty slice
	userBooks := []UserBook{}
	blogBooks := ToBlogBooks(userBooks)

	if len(blogBooks) != 0 {
		t.Errorf("ToBlogBooks() with empty slice should return empty slice, got %d items", len(blogBooks))
	}
}

// Helper functions for creating pointers
func stringPtr(s string) *string {
	return &s
}

func intPtr(i int) *int {
	return &i
}

func float64Ptr(f float64) *float64 {
	return &f
}
