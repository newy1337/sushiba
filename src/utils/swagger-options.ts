import { SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Sushiba API',
  customCss: `
  body { background-color: #1b1b1b }
  p { color: #aaa }
  .swagger-ui .topbar { visibility: hidden }
  .swagger-ui .info .title { color: #e0e4e9 }
  .swagger-ui a.nostyle, .swagger-ui a.nostyle:visited { color: #e0e4e9 }
  .swagger-ui .opblock .opblock-section-header { background: #1b1b1b }
  .swagger-ui .opblock .opblock-section-header h4 { color: #aaa }
  .swagger-ui .opblock-body h5 { color: #aaa }
  .swagger-ui table tbody tr td:first-of-type { color: #aaa }
  .swagger-ui textarea { background: #1b1b1b; color: #aaa }
  .swagger-ui .opblock-body select { background: #1b1b1b; color: #aaa }
  .swagger-ui .parameter__name { color: #aaa }
  .swagger-ui .opblock .opblock-summary-description { color: #aaa }
  .swagger-ui .curl-command { display: none }
  .swagger-ui .scheme-container { background-color: #1b1b1b }
  .swagger-ui .opblock-description-wrapper { color: #969a98; font-size: 16px}
  .swagger-ui section h3 { color: #969a98}
  `,
  swaggerOptions: {
    tryItOutEnabled: true,
    displayRequestDuration: true,
    persistAuthorization: true,
  },
};
