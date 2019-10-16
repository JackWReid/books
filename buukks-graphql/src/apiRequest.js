import chalk from 'chalk';
require('isomorphic-fetch');

function logResolvedRequest(url) {
  console.timeEnd(url);
}

export default async function apiRequest(url) {
  console.time(url);
  return new Promise((resolve, reject) => {
    fetch(`https://api.buukks.xyz/${url}`)
    .then(response => {
      logResolvedRequest(url);
      resolve(response);
    })
    .catch(error => reject(error));
  });
}
