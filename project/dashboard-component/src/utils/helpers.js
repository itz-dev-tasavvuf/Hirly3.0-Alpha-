export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const calculateJobDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end - start;
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : 0;
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'applied':
      return 'Applied';
    case 'interview':
      return 'Interview Scheduled';
    case 'offer':
      return 'Offer Received';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown Status';
  }
};