package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"

	"github.com/go-http-utils/logger"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
)

type ErrorMessage struct {
	Message string `json:"message"`
}

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "ok")
}

func BookById(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	book_id, err := strconv.ParseInt(ps.ByName("id"), 0, 64)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorMessage{"Bad Request"})
		return
	}

	book := book_by_id(int(book_id))
	json.NewEncoder(w).Encode(book)
}

func parse_book_search_query(url *url.URL) SearchQuery {
	query := url.Query()

	term, present := query["term"]
	title := query.Get("title")
	author := query.Get("author")
	category := query.Get("category")
	own, _ := strconv.ParseBool(query.Get("own"))
	read, _ := strconv.ParseBool(query.Get("read"))
	buy, _ := strconv.ParseBool(query.Get("buy"))

	log.Print(present)
	log.Print(term)
	search_params := SearchQuery{term[0], title, author, category, own, read, buy}
	return search_params
}

func BookSearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")

	search_params := parse_book_search_query(r.URL)
	books := book_search(search_params)
	json.NewEncoder(w).Encode(books)
}

// Connect to the database and return the DB type for connections
func connectDb() *sql.DB {
	connStr := "user=postgres dbname=postgres sslmode=disable port=5000"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	return db
}

func main() {
	router := httprouter.New()
	router.GET("/", Index)
	router.GET("/book", BookSearch)
	router.GET("/book/:id", BookById)

	log.Fatal(http.ListenAndServe(":8080", logger.Handler(router, os.Stdout, logger.DevLoggerType)))
}
