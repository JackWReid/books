package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/mmcdole/gofeed"
)

type OkuBookEvent struct {
	Date    string `json:"date_updated"`
	Title   string `json:"title"`
	Author  string `json:"author"`
	OkuGuid string `json:"-"`
}

var OkuReadUrl string = "https://oku.club/rss/collection/zQtTo"
var OkuToreadUrl string = "https://oku.club/rss/collection/JSKHS"
var OkuReadingUrl string = "https://oku.club/rss/collection/2f67M"

var urlMap = map[string]string{
	"reading": OkuReadingUrl,
	"toread":  OkuToreadUrl,
	"read":    OkuReadUrl,
}

func getOkuFetcher(collection string) func() []OkuBookEvent {
	return func() []OkuBookEvent {
		var resItems []OkuBookEvent
		fp := gofeed.NewParser()
		feed, err := fp.ParseURL(urlMap[collection])

		if err != nil {
			fmt.Println(err)
		}

		for _, feedEvent := range feed.Items {
			if feedEvent.Author != nil {
				okuEvent := OkuBookEvent{
					Date:    feedEvent.PublishedParsed.Format("2006-01-02"),
					Title:   feedEvent.Title,
					Author:  feedEvent.Author.Name,
					OkuGuid: feedEvent.GUID,
				}
				resItems = append(resItems, okuEvent)
			}
		}

		return resItems
	}
}

func main() {
	if len(os.Args) < 2 {
		fmt.Fprintf(os.Stderr, "Must provide oku collection: read, reading, toread\n")
		os.Exit(1)
	}

	collection := os.Args[1]
	fetcher := getOkuFetcher(collection)
	books := fetcher()
	b, err := json.Marshal(books)
	if err != nil {
		fmt.Println("error:", err)
	}
	os.Stdout.Write(b)
}
