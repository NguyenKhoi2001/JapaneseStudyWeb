/**
 * Converts an ISO date string to a readable date format.
 * @param {string} isoDateString - The ISO date string to convert.
 * @returns {string} - The date in a readable format ("Month day, year").
 */
export const convertDateToReadableFormat = (isoDateString) => {
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
