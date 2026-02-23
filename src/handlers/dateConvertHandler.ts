export const frontendTimeToBackendTime = ({
  dateStr,
  start_time,
  end_time,
}: {
  dateStr?: string;
  start_time?: string;
  end_time?: string;
}) => {
  const result: Partial<{ date: Date; startTime: Date; endTime: Date }> = {};

  if (dateStr) {
    result.date = new Date(dateStr); // YYYY-MM-DD
  }

  if (start_time) {
    result.startTime = new Date(`1970-01-01T${start_time}`); // HH:MM:SS
  }

  if (end_time) {
    result.endTime = new Date(`1970-01-01T${end_time}`); // HH:MM:SS
  }

  return result;
};
