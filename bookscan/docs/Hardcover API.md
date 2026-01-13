Hardcover has an API. I should [get a key](https://hardcover.app/account/api).

Emma Goto [blogged about using it](https://www.emgoto.com/hardcover-book-api/) to make her reading page.

### Getting all the books you have read
Starting off with a basic GraphQL query, we can filter using the `status_id` to get a list of titles of all the books you have marked as “read” in Hardcover:

```
{
  me {
    user_books(where: {status_id: {_eq: 3}}) {
      rating
      book {
	    slug
        title
        contributions {
          author {
		    name
          }
        }
      }
    }
  }
}
```
### User Book Statuses
The book statuses are an enum with these IDs.

|Status|Description|
|---|---|
|1|Want to Read|
|2|Currently Reading|
|3|Read|
|4|Paused|
|5|Did Not Finished|
|6|Ignored|
### Getting your book reviews
This is what I use to fetch all the reviews I have written in Hardcover:

```
{
  me {
    user_books(
      where: { _and: [ 
        {has_review: {_eq: true}},
        {status_id: {_eq: 3 }}
      ]}
      order_by: [
        { date_added: desc },
        { reviewed_at: desc }
      ]
    ) {
      reviewed_at
      date_added
      review_raw
      rating
      book {
        title
      }
    }
  }
}
```

Nearly all of my books and reviews are imported from Goodreads, and I think sometimes the data gets a little bit messed up in the import. I found that sorting it by both `dated_added` and `reviewed_at` was more accurate
### Searching for a book by title
Hardcover recently released a new [search API](https://docs.hardcover.app/api/guides/searching/). For example, if you wanted to search for a book by it’s title, you would input the following:

```
{
  search(
    query: "dune",
    query_type: "books",
    per_page: 5,
    page: 1
  ) {
    	results
  }
}
```

You can’t get any more specific than `results` - this just returns a huge blob of data, so you would then have to parse through it yourself to get the info you need. If you’re finding it’s not returning the results in the correct order (e.g. searching for Dune returns one of the sequels first) you can add a sort like `activities_count:desc` to get the most popular result first:

```
query Search($title: String!) {
  search(query: $title, query_type: "books", per_page: 5, page: 1, sort: "activities_count:desc") {
    results
  }
}
```
### Getting books in your Hardcover Lists

As well as the standard “want to read” and “read” lists, Hardcover also has a separate custom lists feature. To grab all of your lists, and the books inside of them, you can do the following:

```
{
  me {
    lists(order_by: {created_at: desc}) {
      id
      name
      slug
      list_books {
        book {
          title
        }
      }
    }
  }
}
```
## Adding a book to a list

If you wanted to add a book to a list, first you would need to grab the list ID and the book’s ID. Then it’s easy as the following:

```
mutation addBook {
  insert_list_book(object: {book_id: 123, list_id: 123}) {
    id
  }
}
```
### Making a call with JavaScript
``````javascript
const HARDCOVER_API_KEY = 'Bearer ...';
 
const query = `
{
  me {
    user_books(
      where: {has_review: {_eq: true}}
      order_by: [
        { date_added: desc },
        { reviewed_at: desc }
      ]
    ) {
      review_raw
      rating
      book {
        title
      }
    }
  }
}`;
 
const fetch('https://api.hardcover.app/v1/graphql', {
    headers: {
        'content-type': 'application/json',
        authorization: HARDCOVER_API_KEY,
    },
    body: JSON.stringify({ query }),
    method: 'POST',
})
  .then((response) => response.json())
  .then(({ data }) => {
    const reviews = data.me[0]['user_books'].map(review => {
      // Just as an example of what you could do
      const author = cached_contributors[0].author.name;
      console.log("author!", author);
    });
  });
```
```