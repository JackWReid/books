package api

import (
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"cover/internal/models"

	"golang.org/x/net/html"
)

const (
	GoodreadsSearchURL = "https://www.goodreads.com/search"
	GoodreadsBaseURL   = "https://www.goodreads.com"
	GoodreadsTimeout   = 10 * time.Second
)

// GoodreadsClient represents a client for searching Goodreads
type GoodreadsClient struct {
	client  *http.Client
	baseURL string
}

// NewGoodreadsClient creates a new Goodreads client
func NewGoodreadsClient() *GoodreadsClient {
	return &GoodreadsClient{
		client: &http.Client{
			Timeout: GoodreadsTimeout,
		},
		baseURL: GoodreadsBaseURL,
	}
}

// SearchBook searches for a book by title on Goodreads
func (c *GoodreadsClient) SearchBook(title string) (*models.GoodreadsBook, error) {
	searchURL, err := c.buildSearchURL(title)
	if err != nil {
		return nil, fmt.Errorf("build search URL failed: %w", err)
	}

	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		return nil, fmt.Errorf("create request failed: %w", err)
	}

	// Set user agent to avoid being blocked
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")

	resp, err := c.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("execute request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("Goodreads search failed with status: %d", resp.StatusCode)
	}

	// Parse HTML to extract book information
	doc, err := html.Parse(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("parse HTML failed: %w", err)
	}

	book, err := c.extractBookFromHTML(doc, title)
	if err != nil {
		return nil, fmt.Errorf("extract book failed: %w", err)
	}

	return book, nil
}

// GetBookURL searches for a book and returns its URL
func (c *GoodreadsClient) GetBookURL(title string) (string, error) {
	book, err := c.SearchBook(title)
	if err != nil {
		return "", err
	}
	return book.URL, nil
}

// GetBookByISBN searches for a book by ISBN
func (c *GoodreadsClient) GetBookByISBN(isbn string) (string, error) {
	// Goodreads doesn't have direct ISBN search in the URL, so we'll search by ISBN as title
	return c.GetBookURL(isbn)
}

// buildSearchURL constructs the Goodreads search URL
func (c *GoodreadsClient) buildSearchURL(query string) (string, error) {
	searchURL := c.baseURL + "/search"
	baseURL, err := url.Parse(searchURL)
	if err != nil {
		return "", err
	}

	params := url.Values{}
	params.Set("q", query)

	baseURL.RawQuery = params.Encode()
	return baseURL.String(), nil
}

// extractBookFromHTML extracts book information from Goodreads HTML
func (c *GoodreadsClient) extractBookFromHTML(doc *html.Node, searchTitle string) (*models.GoodreadsBook, error) {
	var bookURL, bookTitle, authorName string
	var foundBook bool

	// Look for the first book row in the tableList
	var findBook func(*html.Node)
	findBook = func(n *html.Node) {
		if foundBook {
			return
		}
		if n.Type == html.ElementNode && n.Data == "tr" {
			// Look for the book link and title
			var findBookLink func(*html.Node)
			findBookLink = func(nn *html.Node) {
				if nn.Type == html.ElementNode && nn.Data == "a" {
					for _, attr := range nn.Attr {
						if attr.Key == "href" && strings.Contains(attr.Val, "/book/show/") {
							bookURL = attr.Val
							if !strings.HasPrefix(bookURL, "http") {
								bookURL = c.baseURL + bookURL
							}
							// Look for <span itemprop='name'> inside this link for the title
							for c := nn.FirstChild; c != nil; c = c.NextSibling {
								if c.Type == html.ElementNode && c.Data == "span" {
									for _, a := range c.Attr {
										if a.Key == "itemprop" && a.Val == "name" {
											bookTitle = getTextContent(c)
										}
									}
								}
							}
						}
					}
				}
				for c := nn.FirstChild; c != nil; c = c.NextSibling {
					findBookLink(c)
				}
			}
			var findAuthor func(*html.Node)
			findAuthor = func(nn *html.Node) {
				if nn.Type == html.ElementNode && nn.Data == "span" {
					for _, attr := range nn.Attr {
						if attr.Key == "itemprop" && attr.Val == "author" {
							// Look for <span itemprop='name'> inside
							for c := nn.FirstChild; c != nil; c = c.NextSibling {
								if c.Type == html.ElementNode && c.Data == "div" {
									for cc := c.FirstChild; cc != nil; cc = cc.NextSibling {
										if cc.Type == html.ElementNode && cc.Data == "a" {
											for ccc := cc.FirstChild; ccc != nil; ccc = ccc.NextSibling {
												if ccc.Type == html.ElementNode && ccc.Data == "span" {
													for _, a := range ccc.Attr {
														if a.Key == "itemprop" && a.Val == "name" {
															authorName = getTextContent(ccc)
															return
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
				for c := nn.FirstChild; c != nil; c = c.NextSibling {
					findAuthor(c)
				}
			}
			findBookLink(n)
			findAuthor(n)
			if bookURL != "" && bookTitle != "" && authorName != "" {
				foundBook = true
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			findBook(c)
		}
	}

	findBook(doc)

	if !foundBook || bookURL == "" || bookTitle == "" || authorName == "" {
		return nil, fmt.Errorf("no book found for title: %s", searchTitle)
	}

	return &models.GoodreadsBook{
		Title:  bookTitle,
		Author: authorName,
		URL:    bookURL,
	}, nil
}

// getTextContent returns the concatenated text content of a node and its children
func getTextContent(n *html.Node) string {
	var sb strings.Builder
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.TextNode {
			sb.WriteString(n.Data)
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(n)
	return strings.TrimSpace(sb.String())
}

// extractBookURLs extracts all book URLs from HTML content
func (c *GoodreadsClient) extractBookURLs(doc *html.Node) []string {
	var urls []string
	bookURLRegex := regexp.MustCompile(`/book/show/\d+`)

	var findURLs func(*html.Node)
	findURLs = func(n *html.Node) {
		if n.Type == html.ElementNode && n.Data == "a" {
			for _, attr := range n.Attr {
				if attr.Key == "href" && bookURLRegex.MatchString(attr.Val) {
					url := attr.Val
					if !strings.HasPrefix(url, "http") {
						url = c.baseURL + url
					}
					urls = append(urls, url)
				}
			}
		}

		for c := n.FirstChild; c != nil; c = c.NextSibling {
			findURLs(c)
		}
	}

	findURLs(doc)
	return urls
}
