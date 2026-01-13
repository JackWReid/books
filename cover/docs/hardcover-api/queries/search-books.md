# Searching books

## Search for books by title
### Query
```
{
  search(
    query: "dune"
    query_type: "books"
    per_page: 2
    page: 1
    sort: "activities_count:desc"
  ) {
    results
  }
}
```

### Response
```json
{
  "data": {
    "search": {
      "results": {
        "facet_counts": [],
        "found": 2,
        "hits": [
          {
            "document": {
              "activities_count": 11,
              "alternative_titles": [
                "Pink Slime"
              ],
              "author_names": [
                "Fernanda Trías",
                "Heather Cleary"
              ],
              "compilation": false,
              "content_warnings": [],
              "contribution_types": [
                "Author",
                "Translation"
              ],
              "contributions": [
                {
                  "author": {
                    "id": 245512,
                    "image": {
                      "color": "#cacbc4",
                      "color_name": "Beige",
                      "height": 116,
                      "id": 272499,
                      "url": "https://assets.hardcover.app/books/245512/4749598-L.jpg",
                      "width": 128
                    },
                    "name": "Fernanda Trías",
                    "slug": "fernanda-trias"
                  },
                  "contribution": null
                },
                {
                  "author": {
                    "id": 271770,
                    "image": {
                      "color": "#e9d6b0",
                      "color_name": "Beige",
                      "height": 475,
                      "id": 297872,
                      "url": "https://assets.hardcover.app/books/271770/1188588-L.jpg",
                      "width": 321
                    },
                    "name": "Heather Cleary",
                    "slug": "heather-cleary"
                  },
                  "contribution": "Translation"
                }
              ],
              "cover_color": "Purple",
              "description": "A harrowing, intimate novel about a woman and the people who depend on her as the world around them teeters on the edge—marking an award-winning Latin American author’s US debut.\n\n“Evocative, dreamlike, and immersive...The disconcerting familiarity of this strange, windswept world will haunt you.” —Esquire • “An intimate, melancholic look at an ecologically ravaged future.” —Silvia Moreno-Garcia, author of Mexican Gothic and Silver Nitrate\n\nIn a city ravaged by a mysterious plague, a woman tries to understand why her world is falling apart. An algae bloom has poisoned the previously pristine air that blows in from the sea. Inland, a secretive corporation churns out the only food anyone can afford—a revolting pink paste, made of an unknown substance. In the short, desperate breaks between deadly windstorms, our narrator stubbornly tends to her few remaining relationships: with her difficult but vulnerable mother; with the ex-husband for whom she still harbors feelings; with the boy she nannies, whose parents sent him away even as terrible threats loomed. Yet as conditions outside deteriorate further, her commitment to remaining in place only grows—even if staying means being left behind.\n\nAn evocative elegy for a safe, clean world, Pink Slime is buoyed by humor and its narrator’s resiliency. This unforgettable novel explores the place where love, responsibility, and self-preservation converge, and the beauty and fragility of our most intimate relationships.",
              "featured_series": {},
              "genres": [
                "Fiction",
                "Science fiction",
                "Dystopian"
              ],
              "has_audiobook": false,
              "has_ebook": false,
              "id": "1122161",
              "image": {
                "color": "#684b4e",
                "color_name": "Purple",
                "height": 152,
                "id": 1656879,
                "url": "https://assets.hardcover.app/external_data/60292260/c198ab6c8612bd7678c8f32e9feb529d55c90e5b.jpeg",
                "width": 98
              },
              "isbns": [
                "9781668049778",
                "9781668049792",
                "9781922585356",
                "9781761385223",
                "1914484304",
                "9781914484308"
              ],
              "lists_count": 13,
              "moods": [],
              "pages": 211,
              "prompts_count": 0,
              "rating": 3.777777777777778,
              "ratings_count": 9,
              "release_date": "2020-10-05",
              "release_year": 2020,
              "reviews_count": 2,
              "series_names": [],
              "slug": "pink-slime",
              "tags": [
                "Loveable Characters"
              ],
              "title": "Pink Slime",
              "users_count": 37,
              "users_read_count": 9
            },
            "highlight": {
              "alternative_titles": [
                {
                  "matched_tokens": [
                    "Pink",
                    "Slime"
                  ],
                  "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
                }
              ],
              "title": {
                "matched_tokens": [
                  "Pink",
                  "Slime"
                ],
                "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
              }
            },
            "highlights": [
              {
                "field": "title",
                "matched_tokens": [
                  "Pink",
                  "Slime"
                ],
                "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
              },
              {
                "field": "alternative_titles",
                "indices": [
                  0
                ],
                "matched_tokens": [
                  [
                    "Pink",
                    "Slime"
                  ]
                ],
                "snippets": [
                  "<mark>Pink</mark> <mark>Slime</mark>"
                ]
              }
            ],
            "text_match": 1157451471441625000,
            "text_match_info": {
              "best_field_score": "2211897868544",
              "best_field_weight": 5,
              "fields_matched": 2,
              "score": "1157451471441625130",
              "tokens_matched": 2
            }
          },
          {
            "document": {
              "activities_count": 0,
              "alternative_titles": [
                "Pink Slime"
              ],
              "author_names": [
                "H.E. Goodhue"
              ],
              "compilation": false,
              "content_warnings": [],
              "contribution_types": [
                "Author"
              ],
              "contributions": [
                {
                  "author": {
                    "id": 865750,
                    "image": {},
                    "name": "H.E. Goodhue",
                    "slug": "he-goodhue"
                  },
                  "contribution": null
                }
              ],
              "featured_series": {},
              "genres": [
                "Science fiction"
              ],
              "has_audiobook": false,
              "has_ebook": false,
              "id": "1511536",
              "image": {},
              "isbns": [],
              "lists_count": 0,
              "moods": [],
              "prompts_count": 0,
              "rating": 0,
              "ratings_count": 0,
              "release_date": "2014-03-01",
              "release_year": 2014,
              "reviews_count": 0,
              "series_names": [],
              "slug": "pink-slime-2014",
              "tags": [],
              "title": "Pink Slime",
              "users_count": 0,
              "users_read_count": 0
            },
            "highlight": {
              "alternative_titles": [
                {
                  "matched_tokens": [
                    "Pink",
                    "Slime"
                  ],
                  "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
                }
              ],
              "title": {
                "matched_tokens": [
                  "Pink",
                  "Slime"
                ],
                "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
              }
            },
            "highlights": [
              {
                "field": "title",
                "matched_tokens": [
                  "Pink",
                  "Slime"
                ],
                "snippet": "<mark>Pink</mark> <mark>Slime</mark>"
              },
              {
                "field": "alternative_titles",
                "indices": [
                  0
                ],
                "matched_tokens": [
                  [
                    "Pink",
                    "Slime"
                  ]
                ],
                "snippets": [
                  "<mark>Pink</mark> <mark>Slime</mark>"
                ]
              }
            ],
            "text_match": 1157451471441625000,
            "text_match_info": {
              "best_field_score": "2211897868544",
              "best_field_weight": 5,
              "fields_matched": 2,
              "score": "1157451471441625130",
              "tokens_matched": 2
            }
          }
        ],
        "out_of": 1820785,
        "page": 1,
        "request_params": {
          "collection_name": "Book_production_1738093885",
          "per_page": 2,
          "q": "Pink Slime"
        },
        "search_cutoff": false,
        "search_time_ms": 1
      }
    }
  }
}
```