export type OkuFeedName = "read" | "toread" | "reading";

export type OkuRawFeedEntry = {
  creator: string;
  title: string;
  link: string;
  pubDate: string;
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
  "dc:creator": string;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
};

export type OkuBookEntry = {
  Guid: string;
  Title: string;
  Author: string;
  ImageUrl?: string;
  Description?: string;
  PubDate: Date;
  UpdateDate: Date;
};

export type OwnedStatus = "owned" | "not-owned" | "on-loan" | "wanted";
export type ReadStatus = "read" | "to-read" | "reading";

export type DbBook = {
  id: number;
  title: string;
  author: string;
  image_url?: string;
  description?: string;
  status_read: ReadStatus;
  status_owned: OwnedStatus;
  oku_id?: string;
  goodreads_id?: string;
  isbn?: string;
  isbn13?: string;
  asin?: string;
  date_published: Date;
  date_updated: Date;
};

export type OkuBookEventEntry = {
  EventType: string;
  BookGuid: string;
  EventDate: Date;
};

export type OkuFeedPull = {
  Date: Date;
  Raw: Object;
  Books: OkuBookEntry[];
  Events: OkuBookEventEntry[];
};
