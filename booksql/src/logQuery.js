import { inverse, cyan, yellow } from 'chalk';

export default function logQuery(req, res, next) {
  if (req.method === 'POST') {
    console.log(inverse.bold.cyan('\n\nPOST'), cyan(new Date()));
    console.log(yellow(req.body.query));
  }
  next();
}
