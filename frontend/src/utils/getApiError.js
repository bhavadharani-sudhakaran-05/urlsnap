/**
 * Extract a user-friendly message from Axios errors.
 */
export const getApiError = (error, fallback = 'Something went wrong') => {
  if (!error) return fallback;
  if (error.code === 'ERR_NETWORK' || !error.response) {
    return 'Cannot reach the API. In a terminal, run: cd backend → npm run dev (port 5000).';
  }
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(', ');
  return fallback;
};
