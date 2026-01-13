import { BookAuthor, BookAuthorKey, BookEdition, BookWork } from '../types/bookResources';
import { OpenLibraryAuthor, OpenLibraryBook, OpenLibraryWork } from '../types/openLibraryResources';

function flatUniq(arr: any): Array<any> {
  return [...new Set(arr.flat())];
}

export function transformAuthor(olAuthor: OpenLibraryAuthor): BookAuthor {
  return {
    ol_id: olAuthor.key,
    name: olAuthor.name,
    date_created: olAuthor.created?.value,
    date_modified: olAuthor.last_modified?.value,
    alternate_names: olAuthor.alternate_names,
    birth_date: olAuthor.birth_date,
    death_date: olAuthor.death_date,
    bio: olAuthor.bio?.value,
    links: olAuthor.links?.map(({ url, title }) => ({ url, title })),
    identifiers: {
      wikidata: olAuthor.remote_ids?.wikidata,
      isni: olAuthor.remote_ids?.isni,
    }
  };
}

export function transformAuthorKey(olAuthor: OpenLibraryAuthor): BookAuthorKey {
  return {
    ol_id: olAuthor.key,
    name: olAuthor.name,
  }
}

export function transformEdition(
  olEdition: OpenLibraryBook,
  authors: BookAuthor[]
): BookEdition {
  return {
    ol_id: olEdition.key,
    title: olEdition.title,
    authors: authors.map((author: BookAuthor) => ({
      id: author.id,
      ol_id: author.ol_id,
      name: author.name,
    })),
    date_created: olEdition.created?.value,
    date_modified: olEdition.last_modified?.value,
    publishers: olEdition.publishers,
    publish_date: olEdition.publish_date,
    publish_places: olEdition.publish_places,
    publish_country: olEdition.publish_country,
    physical_format: olEdition.physical_format,
    identifiers: {
      amazon: olEdition.identifiers?.amazon,
      google: olEdition.identifiers?.google,
      librarything: olEdition.identifiers?.librarything,
      goodreads: olEdition.identifiers?.goodreads,
      isbn_10: olEdition.isbn_10,
      isbn_13: olEdition.isbn_13,
      local_ids: olEdition.local_id,
      source_records: olEdition.source_records,
      oclc_numbers: olEdition.oclc_numbers,
    },
  };
}

export function transformWork(
  olWork: OpenLibraryWork,
  authors: BookAuthor[],
  editions: BookEdition[]
): BookWork {
  return {
    ol_id: olWork.key,
    title: olWork.title,
    authors: authors.map((author: BookAuthor) => ({
      id: author.id,
      ol_id: author.ol_id,
      name: author.name,
    })),
    date_created: olWork.created?.value,
    date_modified: olWork.last_modified?.value,
    subjects: olWork.subjects,
    description: olWork.description?.value,
    links: olWork.links?.map(({ url, title }) => ({ url, title })),
    covers: olWork.covers,
    editions: editions.map((edition: BookEdition) => ({
      id: edition.id,
      ol_id: edition.ol_id,
      physical_format: edition.physical_format,
      publish_country: edition.publish_country,
      publish_date: edition.publish_date,
    })),
    identifiers: {
      isbn_10: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.isbn_10)),
      isbn_13: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.isbn_13)),
      amazon: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.amazon)),
      google: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.google)),
      librarything: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.librarything)),
      goodreads: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.goodreads)),
      local_ids: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.local_ids)),
      source_records: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.source_records)),
      oclc_numbers: flatUniq(editions.map((edition: BookEdition) => edition.identifiers.oclc_numbers)),
      dewey_number: olWork.dewey_number,
      lc_classifications: olWork.lc_classifications,
    }
  };  
}
