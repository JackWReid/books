# User-based queries

## Get my user info
### Query
```
query {
    me {
          id
          username
          birthdate
          books_count
          flair
          followers_count
          followed_users_count
          location
          name
          pro
          pronoun_personal
          pronoun_possessive
          sign_in_count
    }
}
```

### Response
```json
{
  "me": [
    {
      "id": 38068,
      "username": "jwhr",
      "birthdate": null,
      "books_count": 715,
      "flair": null,
      "followers_count": 1,
      "followed_users_count": 4,
      "location": "Berlin",
      "name": "Jack",
      "pro": false,
      "pronoun_personal": "none",
      "pronoun_possessive": "none",
      "sign_in_count": 3
    }
  ]
}
```

## Get all the books I've read
### Query
```
{
  me {
    user_books(order_by: {date_added: desc}, where: {status_id: {_eq: 3}}, limit: 2) {
      book {
        id
        slug
        title
        contributions {
          author {
            name
          }
        }
        subtitle
        image {
          url
        }
      }
      date_added
    }
  }
}
```

### Response
```json
{
  "data": {
    "me": [
      {
        "user_books": [
          {
            "book": {
              "id": 99163,
              "slug": "merchants-of-culture",
              "title": "Merchants of Culture",
              "contributions": [
                {
                  "author": {
                    "name": "John Brookshire Thompson"
                  }
                }
              ],
              "subtitle": "The Publishing Business in the Twenty-First Century",
              "image": {
                "url": "https://assets.hardcover.app/edition/14961525/6596926-L.jpg"
              }
            },
            "date_added": "2025-06-17"
          },
          {
            "book": {
              "id": 1775819,
              "slug": "the-bombshell",
              "title": "The Bombshell",
              "contributions": [
                {
                  "author": {
                    "name": "Darrow Farr"
                  }
                }
              ],
              "subtitle": null,
              "image": {
                "url": "https://assets.hardcover.app/external_data/61564864/cb33fcee6b8d218d0d811fda93f3803d0b9cced2.jpeg"
              }
            },
            "date_added": "2025-06-17"
          }
        ]
      }
    ]
  }
}
```