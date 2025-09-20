import { z } from 'zod';

export const residencySchema = z.object({
  taxYear: z.number().min(2020).max(2100),
  daysInUS: z.number().min(0).max(366),
  hasGreenCard: z.boolean(),
  visaStatus: z.string().min(1),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
  isDualStatus: z.boolean().optional(),
  physicalPresenceDaysAbroad: z.number().min(0).max(366).optional(),
  bonaFideResidence: z.boolean().optional()
});

export type ResidencyFormValues = z.infer<typeof residencySchema>;

export const feieSchema = z.object({
  country: z.string().min(1),
  foreignEarnedIncome: z.number().nonnegative(),
  housingCosts: z.number().nonnegative().optional(),
  taxHome: z.string().min(1),
  qualifiesPhysicalPresence: z.boolean(),
  qualifiesBonaFide: z.boolean()
});

export type FeieFormValues = z.infer<typeof feieSchema>;
