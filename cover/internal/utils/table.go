package utils

import (
	"fmt"
	"strconv"
	"strings"

	"cover/internal/models"
)

// PrintBooksTable prints a list of books in table format
func PrintBooksTable(books []models.Book) {
	if len(books) == 0 {
		fmt.Println("No books found.")
		return
	}

	fmt.Printf("%-6s %-40s %-20s\n", "ID", "Title", "Author")
	fmt.Println(strings.Repeat("-", 70))

	for _, book := range books {
		title := book.Title
		if len(title) > 38 {
			title = title[:35] + "..."
		}

		author := "Unknown"
		if len(book.Contributions) > 0 {
			author = book.Contributions[0].Author.Name
			if len(author) > 18 {
				author = author[:15] + "..."
			}
		}

		fmt.Printf("%-6s %-40s %-20s\n",
			strconv.Itoa(book.ID),
			title,
			author)
	}
}

// PrintSearchBooksTable prints a list of search books in table format
func PrintSearchBooksTable(books []models.SearchBook) {
	if len(books) == 0 {
		fmt.Println("No books found.")
		return
	}

	fmt.Printf("%-6s %-40s %-20s %-8s\n", "ID", "Title", "Author", "Rating")
	fmt.Println(strings.Repeat("-", 80))

	for _, book := range books {
		title := book.Title
		if len(title) > 38 {
			title = title[:35] + "..."
		}

		author := "Unknown"
		if len(book.AuthorNames) > 0 {
			author = book.AuthorNames[0]
			if len(author) > 18 {
				author = author[:15] + "..."
			}
		}

		rating := fmt.Sprintf("%.1f", book.Rating)

		fmt.Printf("%-6s %-40s %-20s %-8s\n",
			book.ID,
			title,
			author,
			rating)
	}
}

// PrintUserBooksTable prints a list of user books in table format
func PrintUserBooksTable(userBooks []models.UserBook) {
	if len(userBooks) == 0 {
		fmt.Println("No books found.")
		return
	}

	fmt.Printf("%-6s %-40s %-15s %-8s %-12s\n", "ID", "Title", "Status", "Rating", "Date Added")
	fmt.Println(strings.Repeat("-", 90))

	for _, userBook := range userBooks {
		status := getStatusName(userBook.StatusID)
		rating := ""
		if userBook.Rating != nil {
			rating = strconv.FormatFloat(*userBook.Rating, 'f', 1, 64)
		}

		title := userBook.Book.Title
		if len(title) > 38 {
			title = title[:35] + "..."
		}

		fmt.Printf("%-6s %-40s %-15s %-8s %-12s\n",
			strconv.Itoa(userBook.Book.ID),
			title,
			status,
			rating,
			userBook.DateAdded.Format("2006-01-02"))
	}
}

// PrintListsTable prints a list of user lists in table format
func PrintListsTable(lists []models.List) {
	if len(lists) == 0 {
		fmt.Println("No lists found.")
		return
	}

	fmt.Printf("%-6s %-30s %-8s %-8s %-40s\n", "ID", "Name", "Books", "Public", "Description")
	fmt.Println(strings.Repeat("-", 95))

	for _, list := range lists {
		description := ""
		if list.Description != nil {
			description = *list.Description
			if len(description) > 38 {
				description = description[:35] + "..."
			}
		}

		public := "No"
		if list.Public {
			public = "Yes"
		}

		name := list.Name
		if len(name) > 28 {
			name = name[:25] + "..."
		}

		fmt.Printf("%-6s %-30s %-8s %-8s %-40s\n",
			strconv.Itoa(list.ID),
			name,
			strconv.Itoa(list.BooksCount),
			public,
			description)
	}
}

// PrintListBooksTable prints books in a specific list in table format
func PrintListBooksTable(list *models.List) {
	if len(list.ListBooks) == 0 {
		fmt.Println("No books found in list.")
		return
	}

	fmt.Printf("%-10s %-40s %-20s %-12s\n", "Position", "Title", "Author", "Date Added")
	fmt.Println(strings.Repeat("-", 85))

	for _, listBook := range list.ListBooks {
		title := listBook.Book.Title
		if len(title) > 38 {
			title = title[:35] + "..."
		}

		author := "Unknown"
		if len(listBook.Book.Contributions) > 0 {
			author = listBook.Book.Contributions[0].Author.Name
			if len(author) > 18 {
				author = author[:15] + "..."
			}
		}

		fmt.Printf("%-10s %-40s %-20s %-12s\n",
			strconv.Itoa(listBook.Position),
			title,
			author,
			listBook.DateAdded.Format("2006-01-02"))
	}
}

// PrintUserInfoTable prints user information in table format
func PrintUserInfoTable(user *models.User) {
	if user == nil {
		fmt.Println("No user information found.")
		return
	}

	fmt.Printf("%-20s %-30s\n", "Field", "Value")
	fmt.Println(strings.Repeat("-", 55))

	fields := []struct {
		label string
		value string
	}{
		{"ID", strconv.Itoa(user.ID)},
		{"Username", user.Username},
		{"Name", getStringValue(user.Name)},
		{"Books Count", strconv.Itoa(user.BooksCount)},
		{"Followers", strconv.Itoa(user.FollowersCount)},
		{"Following", strconv.Itoa(user.FollowedUsersCount)},
		{"Location", getStringValue(user.Location)},
		{"Pro", strconv.FormatBool(user.Pro)},
		{"Pronouns", fmt.Sprintf("%s/%s", user.PronounPersonal, user.PronounPossessive)},
		{"Sign In Count", strconv.Itoa(user.SignInCount)},
	}

	for _, field := range fields {
		fmt.Printf("%-20s %-30s\n", field.label, field.value)
	}
}

// getStatusName returns the human-readable name for a status ID
func getStatusName(statusID int) string {
	switch statusID {
	case 1:
		return "Want to Read"
	case 2:
		return "Currently Reading"
	case 3:
		return "Read"
	case 4:
		return "Paused"
	case 5:
		return "Did Not Finish"
	case 6:
		return "Ignored"
	default:
		return "Unknown"
	}
}

// getStringValue safely returns a string value or "N/A" if nil
func getStringValue(s *string) string {
	if s == nil {
		return "N/A"
	}
	return *s
}
