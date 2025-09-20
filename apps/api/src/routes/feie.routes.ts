import { Router } from 'express';
import Joi from 'joi';
import { computeFeie } from '@expat/tax-engine';

const schema = Joi.object({
  taxYear: Joi.number().default(new Date().getFullYear()),
  foreignEarnedIncome: Joi.number().required(),
  housingCosts: Joi.number().optional(),
  qualifiesPhysicalPresence: Joi.boolean().required(),
  qualifiesBonaFide: Joi.boolean().required(),
  country: Joi.string().optional()
});

export const feieRouter = Router();

feieRouter.post('/evaluate', (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return next(error);

  try {
    const result = computeFeie({
      taxYear: value.taxYear,
      foreignEarnedIncome: value.foreignEarnedIncome,
      housingCosts: value.housingCosts,
      qualifiesPhysicalPresence: value.qualifiesPhysicalPresence,
      qualifiesBonaFideResidence: value.qualifiesBonaFide,
      country: value.country
    });
    res.json({
      maximumExclusion: result.exclusionAmount,
      housingExclusion: result.housingExclusion,
      qualifies: result.qualifies,
      notes: result.notes
    });
  } catch (err) {
    next(err);
  }
});
