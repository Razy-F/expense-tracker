export const handleError = (error, functionName) => {
  console.error(`Error in ${functionName}: `, error);
  throw new Error(error.message || "Internal server error");
};
