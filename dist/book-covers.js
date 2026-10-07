export function coverUrlForIsbn(isbn) {
  const value=String(isbn??'').replace(/[^0-9X]/gi,'').toUpperCase();
  if(!/^(?:\d{9}[\dX]|\d{13})$/.test(value))throw new TypeError('A 10- or 13-character ISBN is required.');
  return `https://covers.openlibrary.org/b/isbn/${value}-M.jpg?default=false`;
}
