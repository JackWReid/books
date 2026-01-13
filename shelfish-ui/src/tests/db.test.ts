import { describe, test, expect } from "bun:test";
import { getBooksBySearch } from "../server/db";

describe("getBooksBySearch", () => {
  test("returns based on title Like Love", async () => {
    const results = await getBooksBySearch({ search: "Like Love" });
    expect(results.length).toBeGreaterThan(0);
    const firstResult = results[0];
    expect(firstResult.title).toEqual("Like Love");
    expect(firstResult.isbn).toEqual("1644452812");
  });

  test("returns nothing for gibberish", async () => {
    const results = await getBooksBySearch({ search: "sfjlhsfjhf3f" });
    expect(results.length).toEqual(0);
  });

  test("returns nothing for empty query", async () => {
    const results = await getBooksBySearch({ search: "" });
    expect(results.length).toEqual(0);
  });

  test("returns nothing for malformed query", async () => {
    const results = await getBooksBySearch({ q: "f" });
    expect(results.length).toEqual(0);
  });
});
