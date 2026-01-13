export interface BookAuthorKey {
  id?: number;
  ol_id: string;
  name: string;
}

export interface BookEditionKey {
  id?: number;
  ol_id: string;
  physical_format?: string;
  publish_country?: string;
  publish_date?: string;
}

interface BookResourceExternalLink {
  title: string;
  url: string;
}

interface BookAuthorIdentifiers {
  wikidata?: string;
  isni?: string;
}

interface BookEditionIdentifiers {
  isbn_10?: string[];
  isbn_13?: string[];
  local_ids?: string[];
  source_records?: string[];
  oclc_numbers?: string[];
  amazon?: string[];
  google?: string[];
  librarything?: string[];
  goodreads?: string[];
}

interface BookWorkIdentifiers extends BookEditionIdentifiers {
  dewey_number?: string[];
  lc_classifications?: string;
}

interface BookResourceBase {
  id?: number;
  ol_id: string;
  date_created?: string;
  date_modified?: string;
}

export interface BookWork extends BookResourceBase {
  title: string;
  subtitle?: string;
  authors: BookAuthorKey[];
  subjects: string[];
  description?: string;
  links: BookResourceExternalLink[];
  covers: number[];
  editions: BookEditionKey[];
  identifiers: BookWorkIdentifiers;
}

export interface BookEdition extends BookResourceBase {
  title: string;
  authors: BookAuthorKey[];
  publishers: string[];
  publish_date: string;
  publish_places: string[];
  publish_country: string;
  physical_format: string;
  identifiers: BookEditionIdentifiers;  
}

export interface BookAuthor extends BookResourceBase {
  name: string;
  alternate_names?: string[];
  birth_date?: string;
  death_date?: string;
  bio?: string;
  links?: BookResourceExternalLink[];
  identifiers?: BookAuthorIdentifiers;
}
