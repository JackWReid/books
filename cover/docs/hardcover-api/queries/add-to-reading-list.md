# Reading list

## Add to reading list by ID
### Query
```
mutation AddToWantToRead($bookId: Int!) {
  insert_user_book(object: {book_id: $bookId, status_id: 1}) {
    id
  }
}
```

```json
```