package api

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"golang.org/x/net/html"
)

func TestBuildSearchURL(t *testing.T) {
	client := NewGoodreadsClient()
	url, err := client.buildSearchURL("test book")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(url, "goodreads.com/search") {
		t.Errorf("unexpected url: %s", url)
	}
	if !strings.Contains(url, "q=test+book") {
		t.Errorf("url should contain query parameter: %s", url)
	}
}

func TestSearchBook_Success(t *testing.T) {
	htmlFixture := `
<table cellspacing="0" cellpadding="0" border="0" width="100%" class="tableList">
  <tr itemscope itemtype="http://schema.org/Book">
    <td width="5%" valign="top">
      <div id="199797823" class="u-anchorTarget"></div>
        <a title="Pink Slime" href="/book/show/199797823-pink-slime?from_search=true&amp;from_srp=true&amp;qid=dRqpKqxSpQ&amp;rank=1">
          <img alt="Pink Slime" class="bookCover" itemprop="image" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1700849710i/199797823._SX50_.jpg" />
</a>    </td>
    <td width="100%" valign="top">
      <a class="bookTitle" itemprop="url" href="/book/show/199797823-pink-slime?from_search=true&amp;from_srp=true&amp;qid=dRqpKqxSpQ&amp;rank=1">
        <span itemprop='name' role='heading' aria-level='4'>Pink Slime</span>
</a>      <br/>
        <span class='by'>by</span>
<span itemprop='author' itemscope='' itemtype='http://schema.org/Person'>
<div class='authorName__container'>
<a class="authorName" itemprop="url" href="https://www.goodreads.com/author/show/6898113.Fernanda_Tr_as?from_search=true&amp;from_srp=true"><span itemprop="name">Fernanda Trías</span></a>, 
</div>
<div class='authorName__container'>
<a class="authorName" itemprop="url" href="https://www.goodreads.com/author/show/5320984.Heather_Cleary?from_search=true&amp;from_srp=true"><span itemprop="name">Heather Cleary</span></a> <span class="authorName greyText smallText role">(Translator)</span>
</div>
</span>
        <br/>
        <div>
          <span class="greyText smallText uitext">
                <span class="minirating"><span class="stars staticStars notranslate"><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p6"></span><span size="12x12" class="staticStar p0"></span></span> 3.58 avg rating &mdash; 5,405 ratings</span>
              &mdash;
                published
               2020
              &mdash;
              <a class="greyText" rel="nofollow" href="/work/editions/86776814-mugre-rosa">28 editions</a>
          </span>
        </div>
    </td>
    <td width="130px" >
      </td>
  </tr>
</table>
`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" {
			t.Errorf("expected GET request, got %s", r.Method)
		}
		if !strings.Contains(r.URL.String(), "q=Pink+Slime") {
			t.Errorf("expected query parameter, got %s", r.URL.String())
		}
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	book, err := client.SearchBook("Pink Slime")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if book.Title == "" {
		t.Errorf("expected non-empty title, got '%s'", book.Title)
	}
	if book.Author == "" {
		t.Errorf("expected non-empty author, got '%s'", book.Author)
	}
	if !strings.Contains(book.URL, "/book/show/199797823") {
		t.Errorf("expected URL to contain book ID, got '%s'", book.URL)
	}
}

func TestSearchBook_NotFound(t *testing.T) {
	htmlFixture := `<html><body><div>No results found</div></body></html>`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	_, err := client.SearchBook("Not Found")
	if err == nil {
		t.Error("expected error for not found book, got nil")
	} else if !strings.Contains(err.Error(), "no book found") {
		t.Errorf("expected 'no book found' error, got: %v", err)
	}
}

func TestSearchBook_HTTPError(t *testing.T) {
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	_, err := client.SearchBook("Test")
	if err == nil {
		t.Error("expected error for HTTP error, got nil")
	} else if !strings.Contains(err.Error(), "status: 500") {
		t.Errorf("expected HTTP error, got: %v", err)
	}
}

func TestGetBookURL_Success(t *testing.T) {
	htmlFixture := `
<table cellspacing="0" cellpadding="0" border="0" width="100%" class="tableList">
  <tr itemscope itemtype="http://schema.org/Book">
    <td width="5%" valign="top">
      <div id="1" class="u-anchorTarget"></div>
        <a title="Book Title" href="/book/show/1-book-title?from_search=true&amp;from_srp=true&amp;qid=test&amp;rank=1">
          <img alt="Book Title" class="bookCover" itemprop="image" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/test.jpg" />
</a>    </td>
    <td width="100%" valign="top">
      <a class="bookTitle" itemprop="url" href="/book/show/1-book-title?from_search=true&amp;from_srp=true&amp;qid=test&amp;rank=1">
        <span itemprop='name' role='heading' aria-level='4'>Book Title</span>
</a>      <br/>
        <span class='by'>by</span>
<span itemprop='author' itemscope='' itemtype='http://schema.org/Person'>
<div class='authorName__container'>
<a class="authorName" itemprop="url" href="https://www.goodreads.com/author/show/123-author-name"><span itemprop="name">Author Name</span></a>
</div>
</span>
        <br/>
        <div>
          <span class="greyText smallText uitext">
                <span class="minirating"><span class="stars staticStars notranslate"><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p6"></span><span size="12x12" class="staticStar p0"></span></span> 3.58 avg rating &mdash; 100 ratings</span>
              &mdash;
                published
               2020
              &mdash;
              <a class="greyText" rel="nofollow" href="/work/editions/test">1 edition</a>
          </span>
        </div>
    </td>
    <td width="130px" >
      </td>
  </tr>
</table>
`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	url, err := client.GetBookURL("Book Title")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(url, "/book/show/1") {
		t.Errorf("expected URL to contain book ID, got '%s'", url)
	}
}

func TestGetBookURL_NotFound(t *testing.T) {
	htmlFixture := `<html><body><div>No results</div></body></html>`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	_, err := client.GetBookURL("Not Found")
	if err == nil {
		t.Error("expected error for not found book, got nil")
	} else if !strings.Contains(err.Error(), "no book found") {
		t.Errorf("expected 'no book found' error, got: %v", err)
	}
}

func TestGoodreadsGetBookByISBN(t *testing.T) {
	htmlFixture := `
<table cellspacing="0" cellpadding="0" border="0" width="100%" class="tableList">
  <tr itemscope itemtype="http://schema.org/Book">
    <td width="5%" valign="top">
      <div id="123" class="u-anchorTarget"></div>
        <a title="ISBN Book" href="/book/show/123-isbn-book?from_search=true&amp;from_srp=true&amp;qid=test&amp;rank=1">
          <img alt="ISBN Book" class="bookCover" itemprop="image" src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/test.jpg" />
</a>    </td>
    <td width="100%" valign="top">
      <a class="bookTitle" itemprop="url" href="/book/show/123-isbn-book?from_search=true&amp;from_srp=true&amp;qid=test&amp;rank=1">
        <span itemprop='name' role='heading' aria-level='4'>ISBN Book</span>
</a>      <br/>
        <span class='by'>by</span>
<span itemprop='author' itemscope='' itemtype='http://schema.org/Person'>
<div class='authorName__container'>
<a class="authorName" itemprop="url" href="https://www.goodreads.com/author/show/456-isbn-author"><span itemprop="name">ISBN Author</span></a>
</div>
</span>
        <br/>
        <div>
          <span class="greyText smallText uitext">
                <span class="minirating"><span class="stars staticStars notranslate"><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p10"></span><span size="12x12" class="staticStar p6"></span><span size="12x12" class="staticStar p0"></span></span> 3.58 avg rating &mdash; 100 ratings</span>
              &mdash;
                published
               2020
              &mdash;
              <a class="greyText" rel="nofollow" href="/work/editions/test">1 edition</a>
          </span>
        </div>
    </td>
    <td width="130px" >
      </td>
  </tr>
</table>
`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	url, err := client.GetBookByISBN("1234567890")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !strings.Contains(url, "/book/show/123") {
		t.Errorf("expected URL to contain book ID, got '%s'", url)
	}
}

func TestExtractBookURLs(t *testing.T) {
	htmlFixture := `
	<html><body>
	<div>
		<a href="/book/show/1">Book 1</a>
		<a href="/book/show/2">Book 2</a>
		<a href="/author/show/123">Author</a>
		<a href="/book/show/3">Book 3</a>
	</div>
	</body></html>
	`

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html")
		fmt.Fprint(w, htmlFixture)
	})
	server := httptest.NewServer(handler)
	defer server.Close()

	client := &GoodreadsClient{
		client:  server.Client(),
		baseURL: server.URL,
	}

	// Parse the HTML
	resp, err := http.Get(server.URL)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	defer resp.Body.Close()

	doc, err := html.Parse(resp.Body)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	urls := client.extractBookURLs(doc)
	if len(urls) != 3 {
		t.Errorf("expected 3 book URLs, got %d", len(urls))
	}

	expectedURLs := []string{"/book/show/1", "/book/show/2", "/book/show/3"}
	for i, expected := range expectedURLs {
		if !strings.Contains(urls[i], expected) {
			t.Errorf("expected URL to contain %s, got %s", expected, urls[i])
		}
	}
}
