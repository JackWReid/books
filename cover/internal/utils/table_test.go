package utils

import (
	"cover/internal/models"
	"testing"
)

func TestPrintBooksTable(t *testing.T) {
	books := []models.Book{
		{
			ID:    1,
			Title: "Test Book",
			Contributions: []models.Contribution{
				{
					Author: models.Author{
						Name: "Test Author",
					},
				},
			},
		},
	}
	// This just checks that the function runs without panic (output is visual)
	PrintBooksTable(books)
}

func TestPrintSearchBooksTable(t *testing.T) {
	books := []models.SearchBook{
		{
			ID:          "123",
			Title:       "Search Test Book",
			AuthorNames: []string{"Search Author"},
			Rating:      4.5,
		},
	}
	// This just checks that the function runs without panic (output is visual)
	PrintSearchBooksTable(books)
}

func TestPrintUserBooksTable(t *testing.T) {
	userBooks := []models.UserBook{
		{
			ID:       1,
			StatusID: 3,
			Book: models.Book{
				ID:    1,
				Title: "Test Book",
				Contributions: []models.Contribution{
					{
						Author: models.Author{
							Name: "Test Author",
						},
					},
				},
			},
		},
	}
	// This just checks that the function runs without panic (output is visual)
	PrintUserBooksTable(userBooks)
}

func TestPrintListsTable(t *testing.T) {
	lists := []models.List{
		{
			ID:         1,
			Name:       "Test List",
			BooksCount: 5,
			Public:     true,
		},
	}
	// This just checks that the function runs without panic (output is visual)
	PrintListsTable(lists)
}

func TestPrintListBooksTable(t *testing.T) {
	list := &models.List{
		ID:   1,
		Name: "Test List",
		ListBooks: []models.ListBook{
			{
				Position: 1,
				Book: models.Book{
					ID:    1,
					Title: "Test Book",
					Contributions: []models.Contribution{
						{
							Author: models.Author{
								Name: "Test Author",
							},
						},
					},
				},
			},
		},
	}
	// This just checks that the function runs without panic (output is visual)
	PrintListBooksTable(list)
}

func TestPrintUserInfoTable(t *testing.T) {
	user := &models.User{
		ID:                 123,
		Username:           "testuser",
		BooksCount:         50,
		FollowersCount:     10,
		FollowedUsersCount: 5,
		Pro:                false,
		PronounPersonal:    "they",
		PronounPossessive:  "their",
		SignInCount:        25,
	}
	// This just checks that the function runs without panic (output is visual)
	PrintUserInfoTable(user)
}

func TestGetStatusName(t *testing.T) {
	tests := []struct {
		statusID int
		expected string
	}{
		{1, "Want to Read"},
		{2, "Currently Reading"},
		{3, "Read"},
		{4, "Paused"},
		{5, "Did Not Finish"},
		{6, "Ignored"},
		{99, "Unknown"},
	}

	for _, test := range tests {
		result := getStatusName(test.statusID)
		if result != test.expected {
			t.Errorf("getStatusName(%d) = %s, expected %s", test.statusID, result, test.expected)
		}
	}
}

func TestGetStringValue(t *testing.T) {
	tests := []struct {
		input    *string
		expected string
	}{
		{nil, "N/A"},
		{stringPtr("test"), "test"},
		{stringPtr(""), ""},
	}

	for _, test := range tests {
		result := getStringValue(test.input)
		if result != test.expected {
			t.Errorf("getStringValue(%v) = %s, expected %s", test.input, result, test.expected)
		}
	}
}

// Helper function for creating string pointers
func stringPtr(s string) *string {
	return &s
}
