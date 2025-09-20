import { Router } from 'express';
import Joi from 'joi';
import { createReturn, getReturn, computeReturnForId } from '../services/return.service';

const createSchema = Joi.object({
  userId: Joi.string().required(),
  taxYear: Joi.number().required(),
  residencyStatus: Joi.string().required(),
  filingStatus: Joi.string().required(),
  country: Joi.string().required()
});

export const returnRouter = Router();

returnRouter.post('/', async (req, res, next) => {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  if (error) return next(error);

  try {
    const taxReturn = await createReturn(value);
    res.status(201).json(taxReturn);
  } catch (err) {
    next(err);
  }
});

returnRouter.get('/:id', async (req, res, next) => {
  try {
    const taxReturn = await getReturn(req.params.id);
    if (!taxReturn) {
      return res.status(404).json({ message: 'Return not found' });
    }
    res.json(taxReturn);
  } catch (err) {
    next(err);
  }
});

returnRouter.post('/:id/compute', async (req, res, next) => {
  try {
    const result = await computeReturnForId(req.params.id);
    res.json({
      agi: result.agi,
      taxableIncome: result.taxableIncome,
      taxLiability: result.taxLiability,
      credits: result.credits,
      refund: Math.max(result.credits - result.taxLiability, 0),
      balanceDue: Math.max(result.taxLiability - result.credits, 0),
      notes: result.notes
    });
  } catch (err) {
    next(err);
  }
});
