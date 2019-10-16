const transformImages = images => images[Object.keys(images)[0]];

export const transformBook = book => ({
  id: book.id,
  title: book.volumeInfo.title,
  subtitle: book.volumeInfo.subtitle,
  authors: book.volumeInfo.authors,
  image: transformImages(book.volumeInfo.imageLinks),
  pageCount: book.volumeInfo.pageCount,
});
