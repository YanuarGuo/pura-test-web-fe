function timeStamptoDate(time: any) {
  // Parse the timestamp
  const date = new Date(time);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract the day, month, and year
  const day = date.getUTCDate();
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Format the date
  const formattedDate = `${day} ${month} ${year}`;

  return formattedDate;
}

function timeStamptoDateInput(time: any) {
  // Create a new Date object
  const date = new Date(time);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getUTCFullYear();

  // Format the date as yyyy-MM-dd
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate; // Output: 2024-05-11
}

const date = {
  timeStamptoDate,
  timeStamptoDateInput,
};

export default date;
