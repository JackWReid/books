# Get user lists

## Get all lists
### Query
```
{
  me {
    lists(order_by: {created_at: desc}, limit: 2) {
      id
      name
      slug
      list_books {
        date_added
        book {
          id
          slug
          title
          contributions {
            author {
              name
            }
          }
          subtitle
          image {
            url
          }
        }
      }
    }
  }
}
```

### Response
```json
{
  "data": {
    "me": [
      {
        "lists": [
          {
            "id": 184199,
            "name": "Titlese",
            "slug": "titlese",
            "list_books": [
              {
                "date_added": "2025-06-26T16:05:43.941807+00:00",
                "book": {
                  "id": 481892,
                  "slug": "remarkably-bright-creatures",
                  "title": "Remarkably Bright Creatures",
                  "contributions": [
                    {
                      "author": {
                        "name": "Shelby Van Pelt"
                      }
                    }
                  ],
                  "subtitle": "A Novel",
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/59670735/818b8dba4df472df4d9153083bdaefcdd670c84b.jpeg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:07:22.884768+00:00",
                "book": {
                  "id": 431260,
                  "slug": "on-earth-were-briefly-gorgeous",
                  "title": "On Earth We're Briefly Gorgeous",
                  "contributions": [
                    {
                      "author": {
                        "name": "Ocean Vuong"
                      }
                    }
                  ],
                  "subtitle": "A Novel",
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/59818822/161c3877cd6022b8797a0d6b7ccc5e0f1dabeae8.jpeg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:05:59.057509+00:00",
                "book": {
                  "id": 859576,
                  "slug": "the-things-that-we-lost-958403fa-a4b5-46de-bbee-0183dfeb8eb6",
                  "title": "The Things That We Lost",
                  "contributions": [
                    {
                      "author": {
                        "name": "Jyoti Patel"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": null
                }
              },
              {
                "date_added": "2025-06-26T16:07:49.224381+00:00",
                "book": {
                  "id": 478556,
                  "slug": "all-the-light-we-cannot-see",
                  "title": "All the Light We Cannot See",
                  "contributions": [
                    {
                      "author": {
                        "name": "Anthony Doerr"
                      }
                    }
                  ],
                  "subtitle": "A Novel",
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/59533729/98f0b3b01e8ae46a866c292cbb9f4693f02da31e.png"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:08:21.080303+00:00",
                "book": {
                  "id": 605927,
                  "slug": "all-our-yesterdays-1952",
                  "title": "All Our Yesterdays",
                  "contributions": [
                    {
                      "author": {
                        "name": "Natalia Ginzburg"
                      }
                    },
                    {
                      "author": {
                        "name": "Sally Rooney"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/edition/30576888/content.jpeg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:06:16.678012+00:00",
                "book": {
                  "id": 456455,
                  "slug": "how-high-we-go-in-the-dark",
                  "title": "How High We Go in the Dark",
                  "contributions": [
                    {
                      "author": {
                        "name": "Sequoia Nagamatsu"
                      }
                    }
                  ],
                  "subtitle": "A Novel",
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/61595697/c24633f28bb401f0be3919927acfc3385c819e36.jpeg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:07:06.816794+00:00",
                "book": {
                  "id": 434949,
                  "slug": "behind-the-beautiful-forevers",
                  "title": "Behind the Beautiful Forevers: Life, Death, and Hope in a Mumbai Undercity",
                  "contributions": [
                    {
                      "author": {
                        "name": "Katherine Boo"
                      }
                    },
                    {
                      "author": {
                        "name": "Sunil Malhotra"
                      }
                    }
                  ],
                  "subtitle": "Life, Death, and Hope in a Mumbai Undercity",
                  "image": {
                    "url": "https://assets.hardcover.app/edition/2570782/10732930-L.jpg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:05:20.244167+00:00",
                "book": {
                  "id": 441085,
                  "slug": "the-light-of-all-that-falls",
                  "title": "The Light of All That Falls",
                  "contributions": [
                    {
                      "author": {
                        "name": "James Islington"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/edition/30405513/6cfa324e11cecd1e730e3fefd28007de17a688a9.jpeg"
                  }
                }
              },
              {
                "date_added": "2025-06-26T16:06:37.054442+00:00",
                "book": {
                  "id": 649326,
                  "slug": "how-far-the-light-reaches",
                  "title": "How Far the Light Reaches: A Life in Ten Sea Creatures",
                  "contributions": [
                    {
                      "author": {
                        "name": "Sabrina Imbler"
                      }
                    }
                  ],
                  "subtitle": "A Life in Ten Sea Creatures",
                  "image": {
                    "url": "https://assets.hardcover.app/edition/30629457/13128300-L.jpg"
                  }
                }
              }
            ]
          },
          {
            "id": 184165,
            "name": "Give Me So I Can Read",
            "slug": "give-me-so-i-can-read",
            "list_books": [
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 473712,
                  "slug": "the-books-of-jacob",
                  "title": "The Books of Jacob",
                  "contributions": [
                    {
                      "author": {
                        "name": "Olga Tokarczuk"
                      }
                    },
                    {
                      "author": {
                        "name": "Jennifer  Croft"
                      }
                    },
                    {
                      "author": {
                        "name": "Allen Lewis Rickman"
                      }
                    },
                    {
                      "author": {
                        "name": "Gilli Messer"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/edition/30394762/58276619._SX98_.jpg"
                  }
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 23645,
                  "slug": "the-naked-and-the-dead",
                  "title": "The Naked and the Dead",
                  "contributions": [
                    {
                      "author": {
                        "name": "Norman Mailer"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/43282914/b64c55c714017180d63a8adddb4a62c60ecc3dee.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 1400247,
                  "slug": "rave-1998",
                  "title": "Rave",
                  "contributions": [
                    {
                      "author": {
                        "name": "Rainald Goetz"
                      }
                    }
                  ],
                  "subtitle": "Erz ahlung",
                  "image": {
                    "url": "https://assets.hardcover.app/edition/31726136/156bb26c0f4f3642d4c122a6bbd5167e45b2112f.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-23T00:00:00+00:00",
                "book": {
                  "id": 588213,
                  "slug": "the-song-of-the-cell",
                  "title": "The Song of the Cell: An Exploration of Medicine and the New Human",
                  "contributions": [
                    {
                      "author": {
                        "name": "Siddhartha Mukherjee"
                      }
                    }
                  ],
                  "subtitle": "An Exploration of Medicine and the New Human",
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/59624640/a6972ea51f5708208faa9fcd19e17e00494dd0f4.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 524042,
                  "slug": "insane",
                  "title": "Insane",
                  "contributions": [
                    {
                      "author": {
                        "name": "Rainald Goetz"
                      }
                    },
                    {
                      "author": {
                        "name": "Adrian Nathan West"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": null
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 926432,
                  "slug": "septology",
                  "title": "Septology",
                  "contributions": [
                    {
                      "author": {
                        "name": "Jon Fosse"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/edition/30951583/7ebcf5215d52f704aec2dd844fe236bd095e23a4.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 386719,
                  "slug": "cryptonomicon",
                  "title": "Cryptonomicon",
                  "contributions": [
                    {
                      "author": {
                        "name": "Neal Stephenson"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/book_mappings/7332619/2b8c686e09d465bb1b8aa2fd9531be4d6842e9a1.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-14T00:00:00+00:00",
                "book": {
                  "id": 1928172,
                  "slug": "howdie-skelp",
                  "title": "Howdie-Skelp",
                  "contributions": [
                    {
                      "author": {
                        "name": "Paul Muldoon"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/edition/32079548/758f8a5944fa004716da20a39a5283267b414377.jpeg"
                  }
                }
              },
              {
                "date_added": "2022-11-15T00:00:00+00:00",
                "book": {
                  "id": 260343,
                  "slug": "invisible-cities",
                  "title": "Invisible Cities",
                  "contributions": [
                    {
                      "author": {
                        "name": "Italo Calvino"
                      }
                    },
                    {
                      "author": {
                        "name": "William Weaver"
                      }
                    },
                    {
                      "author": {
                        "name": "Wayne Thiebaud"
                      }
                    }
                  ],
                  "subtitle": null,
                  "image": {
                    "url": "https://assets.hardcover.app/external_data/24060934/7fde80aca0397bff2277f5b6239b751c33f8b4da.jpeg"
                  }
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```