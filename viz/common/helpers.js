// Take in an ISO-8601 string and return just the year as an integer
export function getYear(dateString) {
  const year = dateString.split('-');
  return parseInt(year, 10);
}

// Take in a year and get back the decade.
export function getDecade(year) {
  return Math.trunc(year / 10) * 10;
}
