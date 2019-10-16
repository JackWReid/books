import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWords from 'date-fns/distance_in_words';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import format from 'date-fns/format';

/**
* Formatting Incoming Formats
**/

export function unixDateString(string) {
  return new Date(parseInt(string, 10));
}

/**
* Absolute Time Presentations
**/

export function sortableDate(date) {
  return format(date, 'YYYY-MM-DD');
}

export function shortDate(date) {
  return format(date, 'Do MMM');
}

export function fullDate(date) {
  return format(date, 'Do MMMM YYYY');
}

export function fullDateTime(date) {
  return format(date, 'Do MMMM YY, h:mmA');
}

export function timeOfDay(date) {
  return format(date, 'h:mmA');
}



/**
* Relative Time Presentations
**/

export function hoursAgo(dateThen) {
  const dateNow = new Date();
  return differenceInHours(dateNow, dateThen);
}

export function ageInHours(dateThen) {
  return `${hoursAgo(dateThen)} hours`;
}

export function timeAgoinHours(dateThen) {
  return `${ageInHours(dateThen)} ago`;
}

export function timeAgo(dateThen) {
  const difference = distanceInWordsToNow(dateThen, {
    includeSeconds: true,
  });
  return `${difference} ago`;
}

export function hoursElapsedBetween(a, b) {
  return differenceInHours(a, b);
}

export function timeElapsedBetween(a, b) {
  return distanceInWords(a, b);
}


/**
* Evaluations
**/

export function sortableDateDiff(a, b) {
  return differenceInMilliseconds(a, b);
}
