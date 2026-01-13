import { titleCase, stripHtml, randomCoverPlaceHolder } from "../../utils";
import { Layout } from "../components/Layout";

export function BookSinglePage({ book }) {
  return (
    <Layout title={book.title}>
      <article className="grid grid-cols-4 gap-4">
        <div className="">
          <img
            src={book.image_url || randomCoverPlaceHolder()}
            className="w-full max-w-full max-h-full"
            alt={`Cover of ${book.title}`}
          />
        </div>
        <div className="col-span-3">
          <h1 className="font-semibold text-4xl">{book.title}</h1>
          <h2 className="text-xl">by {book.author}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stripHtml(book.description)}
          </p>
          {/* <div className="relative bg-gray-50 rounded-lg dark:bg-gray-700 p-4 h-64">
            <code className="text-sm text-gray-500 dark:text-gray-400 text-wrap">
              {JSON.stringify(book)}
            </code>
          </div> */}
        </div>
      </article>
    </Layout>
  );
}
