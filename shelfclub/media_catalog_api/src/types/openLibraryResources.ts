enum OpenLibraryResourceType {
  Link = "/type/link",
  Text = "/type/text",
  DateTime = "/type/datetime",
  AuthorRole = "type/authorrole",
  Work = "type/author_role",
}

interface OpenLibraryDate {
  type: OpenLibraryResourceType;
  value: string;
}

interface OpenLibraryAuthorReference {
  type: {
    key: OpenLibraryResourceType;
  };
  author: {
    key: string;
  };
}

interface OpenLibraryAuthorKey {
  key: string;
}

interface OpenLibraryWorkKey {
  key: string;
}

interface OpenLibraryResourceDescription {
  type: OpenLibraryResourceType;
  value: string;
}

interface OpenLibraryExternalLink {
  url: string;
  title: string;
  type: {
    key: OpenLibraryResourceType;
  };
}

interface OpenLibraryBookIdentifiers {
  amazon?: string[];
  google?: string[];
  librarything?: string[];
  goodreads?: string[];
}

interface OpenLibraryAuthorRemoteIds {
  viaf?: string;
  wikidata?: string;
  isni?: string;
}

interface OpenLibraryResource {
  key: string;
  created?: OpenLibraryDate;
  last_modified?: OpenLibraryDate;
  revision: number;
  latest_revision: number;
}

export interface OpenLibraryWork extends OpenLibraryResource {
  title: string;
  subtitle?: string;
  authors: OpenLibraryAuthorReference[];
  subjects: string[];
  description: OpenLibraryResourceDescription;
  links: OpenLibraryExternalLink[];
  dewey_number: string[];
  lc_classifications: string;
  first_publish_date: string;
  covers: number[];
}

export interface OpenLibraryBook extends OpenLibraryResource {
  title: string;
  by_statement: string;
  authors: OpenLibraryAuthorKey[];
  subjects: string[];
  description: string;
  notes: string;
  works: OpenLibraryWorkKey[];
  publishers: string[];
  publish_date: string;
  publish_places: string[];
  publish_country: string;
  number_of_pages: number;
  covers: number[];
  identifiers?: OpenLibraryBookIdentifiers;
  isbn_10: string[];
  isbn_13: string[];
  oclc_numbers: string[];
  lc_classifications: string;
  ocaid: string;
  dewey_decimal_class: string[];
  local_id: string[];
  source_records: string[];
  pagination: string;
  physical_format: string;
  physical_dimensions: string;
  weight: string;
}

export interface OpenLibraryAuthor extends OpenLibraryResource {
  name: string;
  personal_name?: string;
  alternate_names?: string[];
  birth_date?: string;
  death_date?: string;
  bio?: OpenLibraryResourceDescription;
  links?: OpenLibraryExternalLink[];
  photos?: number[];
  remote_ids?: OpenLibraryAuthorRemoteIds;
}
