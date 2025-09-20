import { Router } from 'express';
import Joi from 'joi';
import { determineResidency } from '@expat/tax-engine';

const schema = Joi.object({
  taxYear: Joi.number().required(),
  daysInUS: Joi.number().required(),
  hasGreenCard: Joi.boolean().required(),
  visaStatus: Joi.string().required(),
  physicalPresenceDaysAbroad: Joi.number().optional(),
  bonaFideResidence: Joi.boolean().optional(),
  isDualStatus: Joi.boolean().optional()
});

export const residencyRouter = Router();

residencyRouter.post('/determine', (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return next(error);

  try {
    const result = determineResidency(value);
    res.json({
      residencyStatus: result.status,
      feieEligible: result.feieEligible,
      recommendedForm: result.recommendedForm,
      rationale: result.rationale
    });
  } catch (err) {
    next(err);
  }
});
