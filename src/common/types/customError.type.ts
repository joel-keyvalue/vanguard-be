export type CustomError = {
  CODE: string;
  MESSAGE: string;
  DETAILS?: any;
};

export type CustomErrors = {
  [key: string]: CustomError;
};
