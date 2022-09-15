export const dateFormatter = (): Intl.DateTimeFormat => {
  return new Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'short'});
}