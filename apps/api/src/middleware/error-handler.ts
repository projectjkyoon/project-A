import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status ?? 400;
  const message = err.message ?? 'Unexpected error';
  res.status(status).json({ message });
};
