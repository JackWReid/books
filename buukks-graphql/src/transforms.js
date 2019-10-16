export const transformBook = book => ({
  id: book.id,
  title: book.title,
  author: book.author,
  description: book.description,
  dateCreated: book.created_at,
  registrant: book.register_user,
});

export const transformUser = user => ({
  id: user.id,
  username: user.username,
  firstName: user.first_name,
  lastName: user.last_name,
  dateCreated: user.created_at,
});

export const transformCollection = collection => ({
  id: collection.id,
  title: collection.title,
  description: collection.description,
  dateCreated: collection.created_at,
});
