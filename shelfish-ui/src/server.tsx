import Bun from "bun";
import { Elysia, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { renderToString } from "react-dom/server";
import { logger } from "@bogeychan/elysia-logger";

import { startService } from "./server/service";
import { getJobList } from "./server/jobs";
import {
  getBooksByReadStatus,
  getBookById,
  getBooks,
  getBooksBySearch,
} from "./server/db";

import BookTableBody from "./ui/components/BookBrowser/BookTableBody";
import { BooksPage } from "./ui/pages/Books";
import { BookSinglePage } from "./ui/pages/BookSingle";
import { JobsPage } from "./ui/pages/Jobs";
import { scrapeGoodreadsByIsbn } from "./server/scraping";

export async function start() {
  await startService();

  const app = new Elysia()
    .use(html())
    .use(logger())
    .use(staticPlugin({ prefix: "" }))
    .get("/", ({ redirect }) => {
      return redirect("/books");
    })
    .get("/books", async () => {
      const books = await getBooks();
      return renderToString(<BooksPage status="none" books={books} />);
    })
    .get("/books/:status", async ({ params: { status } }) => {
      const books = await getBooksByReadStatus(status);
      return renderToString(<BooksPage status={status} books={books} />);
    })
    .get("/book/:id", async ({ params: { id } }) => {
      const book = await getBookById(id);
      return renderToString(<BookSinglePage book={book} />);
    })
    .post(
      "/add",
      async ({ redirect, params, body }) => {
        if (body.isbn) {
          return redirect(`/add/${body.isbn}`);
        }
        console.log({ body, params });
      },
      {
        body: t.Object({
          isbn: t.String(),
        }),
      },
    )
    .get(
      "/add/:isbn",
      async ({ params: { isbn } }) => {
        const grBook = await scrapeGoodreadsByIsbn({ isbn });
        return renderToString(<BookSinglePage book={grBook} />);
      },
      {
        params: t.Object({
          isbn: t.String(),
        }),
      },
    )
    .post(
      "/search",
      async ({ body }) => {
        const { bookSearch } = body;
        const books = await getBooksBySearch({ search: bookSearch });
        return renderToString(<BookTableBody books={books} />);
      },
      {
        body: t.Object({
          bookSearch: t.String(),
        }),
      },
    )
    .get("/jobs", async () => {
      const jobs = await getJobList();
      return renderToString(<JobsPage jobs={jobs} />);
    })
    .listen(3000);
  console.log(`Listening on ${app.server!.url}`);
  return app;
}
