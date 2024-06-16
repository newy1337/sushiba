import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './utils/swagger-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Sushiba API')
    .setDescription(
      `<h3>We are welcomes you with pleasure 👋</n3>
      <p>In order to use this API you first need to register and grab an access-token:</p>
      <ul>
      <li>Go to <a>/auth/sign-in</a> page</li>
      <li>Enter email and password and execute</li>
      <li>Grab your access-token</li>
      <li>Set this token as value under the “Authorize” button</li>
      <li>Congratulations, you have access to use</li>
      </ul>
    `,
    )
    .setVersion('Testing')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      description: '<h5>Insert the received access token during authorization</h5>',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, swaggerOptions);
  await app.listen(3000);
}
bootstrap();
