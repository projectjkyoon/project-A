import { OpenAPIObject } from 'openapi3-ts';

export function createOpenApiDocument(): OpenAPIObject {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Expat Tax Filing API',
      version: '0.1.0',
      description: 'API for managing returns and running the tax computation engine.'
    },
    servers: [{ url: 'http://localhost:4000' }],
    paths: {
      '/returns': {
        post: {
          summary: 'Create a return',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'taxYear', 'residencyStatus', 'filingStatus', 'country'],
                  properties: {
                    userId: { type: 'string' },
                    taxYear: { type: 'integer' },
                    residencyStatus: { type: 'string' },
                    filingStatus: { type: 'string' },
                    country: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '201': { description: 'Return created' }
          }
        }
      },
      '/returns/{id}': {
        get: {
          summary: 'Fetch a return',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Return details' },
            '404': { description: 'Not found' }
          }
        }
      },
      '/returns/{id}/compute': {
        post: {
          summary: 'Run tax computation',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Computation result' }
          }
        }
      },
      '/residency/determine': {
        post: {
          summary: 'Run residency determination',
          responses: {
            '200': { description: 'Residency determination' }
          }
        }
      },
      '/feie/evaluate': {
        post: {
          summary: 'Compute FEIE',
          responses: {
            '200': { description: 'FEIE computation result' }
          }
        }
      },
      '/rates/{year}': {
        get: {
          summary: 'Get annual currency conversion rates',
          parameters: [{ name: 'year', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            '200': { description: 'Rates' }
          }
        }
      }
    },
    components: {}
  };
}
