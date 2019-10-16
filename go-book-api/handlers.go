package main

import (
	"log"
)

type Book struct {
	ID       int     `json:"id"`
	Title    string  `json:"title"`
	Author   *string `json:"author", omitempty`
	Category string  `json:"category"`
	Own      bool    `json:"own"`
	Read     bool    `json:"read"`
	Buy      bool    `json:"buy"`
}

type SearchQuery struct {
	Term     string
	Title    string
	Author   string
	Category string
	Own      bool
	Read     bool
	Buy      bool
}

func book_by_id(id int) Book {
	db := connectDb()

	rows, err := db.Query("SELECT id, title, author, category, own, read, buy FROM books WHERE id = $1 LIMIT 1", id)
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var b Book
	for rows.Next() {
		if err := rows.Scan(&b.ID, &b.Title, &b.Author, &b.Category, &b.Own, &b.Read, &b.Buy); err != nil {
			log.Fatal(err)
		}
	}

	rerr := rows.Close()
	if rerr != nil {
		log.Fatal(err)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return b
}

func book_search(search_params SearchQuery) []Book {
	db := connectDb()
	log.Print(search_params)

	rows, err := db.Query("SELECT id, title, author, category, own, read, buy FROM books")
	if err != nil {
		log.Fatal(err)
	}

	defer rows.Close()

	var books []Book

	for rows.Next() {
		var b Book
		if err := rows.Scan(&b.ID, &b.Title, &b.Author, &b.Category, &b.Own, &b.Read, &b.Buy); err != nil {
			log.Fatal(err)
		}

		books = append(books, b)
	}

	rerr := rows.Close()
	if rerr != nil {
		log.Fatal(err)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return books
}
