import { titleCase } from "../../utils";

import { Layout } from "../components/Layout";
import BookBrowser from "../components/BookBrowser";

export function BooksPage({ status, books }) {
  const title = titleCase(status);

  return (
    <Layout title={title}>
      <div>
        <BookBrowser books={books} />
      </div>
    </Layout>
  );
}
