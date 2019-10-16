# Buukks API

## Basic Endpoints

### Root Request - `GET /`
Returns a simple message with a link to the API documentation.
```
{
  "message": "Buukks API - see docs at http://github.com/JackWReid/buukksapi"
}
```

### Ping - `GET /ping`
Returns a simple message with the time of the request. At some point I should add some health checks here, too.
```
{
  "message": "Buukks API ping, current time: Sat Sep 24 2016 21:19:45 GMT+0100 (BST)"
}
```

## User Endpoints

### Get All Users - `GET /user/all`
Returns an array of all the users in the whole system. If this thing ever gets any scale, this is the first thing to go.
```
[
  {
    "profile": {
      "fullName": "Jack Reid",
      "image": "http://pbs.twimg.com/profile_images/736181204362362881/-jTmWkEW_normal.jpg",
      "lastLogin": 1474727226878,
      "uid": "WdJCTIIi66Mqn0N8tG7aSAfVVlx2"
    }
  }
]
```

### Get User by ID - `GET /user/:id`
Returns a user object for the user at the ID supplied.
```
{
  "fullName": "Jack Reid",
  "image": "http://pbs.twimg.com/profile_images/736181204362362881/-jTmWkEW_normal.jpg",
  "lastLogin": 1474727226878,
  "uid": "WdJCTIIi66Mqn0N8tG7aSAfVVlx2"
}
```

### Get User Current Reading by ID - `GET /user/:id/books/current`
The books the user is currently reading. Returns a list of book wrapper objects with information about when the user began reading the book and about their feelings toward the book. Finally, a book ID that refers to the actual book object.
```
[
  {
    "bookID": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
    "dateBegan": <Date>,
    "sentiments": {
      "rating": "3",
      "comment": "This book is pretty great and I am unoriginal."
    }
  }
]
```

### Get User Reading History by ID - `GET /user/:id/books/history`
The books a user has read in the past and is not currently reading. Returns a list of book wrapper objects with information about when the user began reading the book and about their feelings toward the book. Finally, a book ID that refers to the actual book object.
```
[
  {
    "bookID": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
    "dateBegan": <Date>,
    "dateEnded": <Date>,
    "sentiments": {
      "rating": "3",
      "comment": "This book is pretty great and I am unoriginal."
    }
  }
]
```

### Get User Abandoned Books by ID - `GET /user/:id/books/abandoned`
The books a user has started reading and abandoned. Returns a list of book wrapper objects with information about when the user began reading the book and about their feelings toward the book. Finally, a book ID that refers to the actual book object.
```
[
  {
    "bookID": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
    "dateBegan": <Date>,
    "dateEnded": <Date>,
    "sentiments": {
      "rating": "3",
      "comment": "This book is pretty great and I am unoriginal."
    }
  }
]
```

## Book Endpoints

### Get All Books - `GET /book/all`
Returns a list of all the books on the service. Again, this is an endpoint that will have to go away at scale.
```
[
  {
    "_id": "57e6dc9e430e6e6f4acc1e70",
    "publicId": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
    "title": "For Whom The Bell Tolls",
    "author": "Ernest Hemingway",
    "link": "https://www.amazon.co.uk/Whom-Bell-Tolls-Ernest-Hemingway/dp/0099908603",
    "creator": "WdJCTIIi66Mqn0N8tG7aSAfVVlx2"
  }
]
```

### Get Book By ID - `GET /book/:id`
Returns an object for the book at the ID supplied.
```
{
  "_id": "57e6dc9e430e6e6f4acc1e70",
  "publicId": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
  "title": "For Whom The Bell Tolls",
  "author": "Ernest Hemingway",
  "link": "https://www.amazon.co.uk/Whom-Bell-Tolls-Ernest-Hemingway/dp/0099908603",
  "creator": "WdJCTIIi66Mqn0N8tG7aSAfVVlx2"
}
```

### Create Book - `POST /book`
Creates a new book and returns an object of the book created.
```
{
  "_id": "57e6dc9e430e6e6f4acc1e70",
  "publicId": "4a1e3ab0-8292-11e6-a5e7-8ff8cbdaaacb",
  "title": "For Whom The Bell Tolls",
  "author": "Ernest Hemingway",
  "link": "https://www.amazon.co.uk/Whom-Bell-Tolls-Ernest-Hemingway/dp/0099908603",
  "creator": "WdJCTIIi66Mqn0N8tG7aSAfVVlx2"
}
```
