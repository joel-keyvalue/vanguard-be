import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ClassValidatorException } from './common/exceptions/ValidationException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new ClassValidatorException(errors);
      },
    }),
  );
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
