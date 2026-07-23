export function extractErrorMessage(error) {
  if (error?.status === 401) return "Invalid email or password.";
  if (error?.status === 404) return "Resource not found.";
  if (error?.status === 400) {
    const details = error?.data?.error?.details;
    if (details?.length) return details.map((d) => d.message).join(", ");
  }
  if (error?.data?.error?.message) return error.data.error.message;
  if (error?.error) return error.error;
  return "Something went wrong. Please try again.";
}