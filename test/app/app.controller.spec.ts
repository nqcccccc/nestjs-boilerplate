import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@app/app.controller';
import { Request } from 'express';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should  be called', () => {
      expect(
        appController.hello({ __userAgent: 'this is user agent' } as Request),
      ).toBeCalled();
    });
  });
});
