import { Router } from 'express';
import { getAverageRates } from '@expat/tax-engine';

export const ratesRouter = Router();

ratesRouter.get('/:year', (req, res, next) => {
  const year = Number(req.params.year);
  try {
    const rates = getAverageRates(year);
    res.json({ year, rates });
  } catch (error) {
    next(error);
  }
});
