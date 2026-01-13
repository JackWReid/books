import { BookAuthor, BookAuthorKey, BookEdition, BookWork } from '../types/bookResources';
import { OpenLibraryAuthor, OpenLibraryBook, OpenLibraryWork } from '../types/openLibraryResources';

import db from '../db';
import openLibraryApi from '../services/openLibrary';
import { transformAuthor, transformEdition, transformWork } from '../transforms/openLibrary';

export async function resolveBookAuthor(ol_id: string): Promise<BookAuthor> {
  const existingAuthorRecord: BookAuthor = await db.getBookAuthorByOlId(`/authors/${ol_id}`);

  if (existingAuthorRecord) {
    return existingAuthorRecord;
  }

  const originAuthorRecord: OpenLibraryAuthor = await openLibraryApi.getBookAuthorByOlId(ol_id);
  const transformedAuthorRecord: BookAuthor = transformAuthor(originAuthorRecord);
  const savedAuthorRecord = await db.insertBookAuthor(transformedAuthorRecord);

  return savedAuthorRecord;
}

export async function resolveBookEdition(ol_id: string): Promise<BookEdition> {
  const existingEditionRecord: BookEdition = await db.getBookEditionByOlId(`/books/${ol_id}`);

  if (existingEditionRecord) {
    return existingEditionRecord;
  }

  const originEditionRecord: OpenLibraryBook = await openLibraryApi.getBookEditionByOlId(ol_id);

  let authorLinks: BookAuthorKey[] = [];
  if (originEditionRecord.authors) {
    const linkedAuthorIds: string[] = originEditionRecord.authors.map(({key}) => key.split('/')[2]);
    authorLinks = await Promise.all(linkedAuthorIds.map(resolveBookAuthor));
  }

  const transformedEditionRecord: BookEdition = transformEdition(originEditionRecord, authorLinks);
  const savedEditionRecord = db.insertBookEdition(transformedEditionRecord);
  
  return savedEditionRecord;
}

export async function resolveBookWork(ol_id: string): Promise<BookWork> {
  const existingWorkRecord: BookWork = await db.getBookWorkByOlId(`/works/${ol_id}`);

  if (existingWorkRecord) {
    return existingWorkRecord;
  }

  const originWorkRecord: OpenLibraryWork = await openLibraryApi.getBookWorkByOlId(ol_id);
  const originWorkSearch = await openLibraryApi.getBookWorkSearchResult(originWorkRecord.title, originWorkRecord?.authors[0]?.author?.key, ol_id);
  
  let authorLinks: BookAuthorKey[] = [];
  if (originWorkRecord.authors) {
    const linkedAuthorIds: string[] = originWorkRecord.authors.map(({author}) => author.key.split('/')[2]);
    authorLinks = await Promise.all(linkedAuthorIds.map(resolveBookAuthor));
  }

  let editionLinks: BookEdition[] = [];
  if (originWorkSearch.edition_key) {
    editionLinks = await Promise.all(originWorkSearch.edition_key.map(resolveBookEdition));
  }

  const transformedWorkRecord: BookWork = transformWork(originWorkRecord, authorLinks, editionLinks);
  console.log('transformed')
  const savedWorkRecord = await db.insertBookWork(transformedWorkRecord);
  console.log('saved')
  
  return savedWorkRecord;
}
