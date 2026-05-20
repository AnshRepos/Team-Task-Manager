export const toDatetimeLocalValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

export const fromDatetimeLocalValue = (value) => {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
};
