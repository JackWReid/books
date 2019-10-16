exports.seed = function(knex, Promise) {
  return knex('books').del()
    .then(() => {
      return Promise.all([
        knex('books').insert({
          google_id: 'MepRCwAAQBAJ',
          image_url: 'http://books.google.com/books/content?id=MepRCwAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73e5rzzlE7nDgZQRHbs3Ryj-oYjfedc-XNQjF1zU3Xb-Avu96tsTDbiFR4xIUriMzth-xftHaz1yg9SWNJM6cimtA6J9wtoPgmHsloW6V8CKYvkHkyMGuORL5jS_gkA8BlkzIWz&source=gbs_api',
          title: 'The Underground Railroad',
          author: 'Colson Whitehead',
          description: 'Cora is a slave on a cotton plantation in Georgia. Life is hell for all the slaves, but especially bad for Cora; an outcast even among her fellow Africans, she is coming into womanhood—where even greater pain awaits. When Caesar, a recent arrival from Virginia, tells her about the Underground Railroad, they decide to take a terrifying risk and escape. Matters do not go as planned—Cora kills a young white boy who tries to capture her. Though they manage to find a station and head north, they are being hunted.\nIn Whitehead’s ingenious conception, the Underground Railroad is no mere metaphor—engineers and conductors operate a secret network of tracks and tunnels beneath the Southern soil. Cora and Caesar’s first stop is South Carolina, in a city that initially seems like a haven. But the city’s placid surface masks an insidious scheme designed for its black denizens. And even worse: Ridgeway, the relentless slave catcher, is close on their heels. Forced to flee again, Cora embarks on a harrowing flight, state by state, seeking true freedom.\nLike the protagonist of Gulliver’s Travels, Cora encounters different worlds at each stage of her journey—hers is an odyssey through time as well as space. As Whitehead brilliantly re-creates the unique terrors for black people in the pre–Civil War era, his narrative seamlessly weaves the saga of America from the brutal importation of Africans to the unfulfilled promises of the present day. The Underground Railroad is at once a kinetic adventure tale of one woman’s ferocious will to escape the horrors of bondage and a shattering, powerful meditation on the history we all share.',
          register_user: 1,
        }),
        knex('books').insert({
          google_id: 'D5JayJESwo4C',
          image_url: 'http://books.google.com/books/content?id=D5JayJESwo4C&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE70K0nqBVuNrID3FtI-LVwiplMCCtZJhQqjvs5LW5fXkUrlAowVH7eKIqy7FZYDV-DciUsPoHpi-KSErIvYyIb34Ak25ZDGZSs0rtuLeZNM3O27lA5_7Kt5FoVdwOOCl6n4PZI1-&source=gbs_api',
          title: 'All Quiet On The Western Front',
          author: 'Erich Maria Remarque',
          description: 'One by one the boys begin to fall...\nIn 1914 a room full of German schoolboys, fresh-faced and idealistic, are goaded by their schoolmaster to troop off to the glorious war. With the fire and patriotism of youth they sign up. What follows is the moving story of a young unknown soldier experiencing the horror and disillusionment of life in the trenches.',
          register_user: 2,
        }),
      ]);
    });
};
