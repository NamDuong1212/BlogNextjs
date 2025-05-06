export const formatDateTime = (isoString: any) => {
  const date = new Date(isoString);

  const datePart = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Ho_Chi_Minh",
  });

  return `${datePart}, ${timePart}`;
};
