import { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { returnRouter } from './return.routes';
import { residencyRouter } from './residency.routes';
import { feieRouter } from './feie.routes';
import { ratesRouter } from './rates.routes';
import { createOpenApiDocument } from '../services/openapi.service';

export function registerRoutes(app: Express) {
  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/returns', returnRouter);
  app.use('/residency', residencyRouter);
  app.use('/feie', feieRouter);
  app.use('/rates', ratesRouter);

  const openApiDoc = createOpenApiDocument();
  app.use('/docs/openapi.json', (_req: Request, res: Response) => {
    res.json(openApiDoc);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));
}
