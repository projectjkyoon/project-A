import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import { registerRoutes } from '../src/routes';
import { errorHandler } from '../src/middleware/error-handler';

const app = express();
app.use(json());
registerRoutes(app);
app.use(errorHandler);

describe('Return routes', () => {
  it('provides openapi document', async () => {
    const res = await request(app).get('/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body.info.title).toBe('Expat Tax Filing API');
  });
});
