import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';

import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App e2e test', () => {
  // Dependency injection declare block
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 限制request，只傳入DTO規定的內容
        transform: true, // 自動轉換 request Body, 將Body的型別成DTO的類別物件
        forbidNonWhitelisted: true, // 抵擋request，如果request body有DTO規定外的欄位，request被攔截
        transformOptions: {
          enableImplicitConversion: true, // 不需要在額外標示@Type， ValidationPipe會依據原設定資料型態去驗證
        },
      }),
    );
    await app.init();
    await app.listen(3001);

    prismaService = app.get(PrismaService);
    await prismaService.cleanDb();
    pactum.request.setBaseUrl('http:localhost:3001');
  });

  afterAll(async () => {
    app.close();
  });

  describe('[Feature] Auth - /auth', () => {
    const authDto: AuthDto = {
      email: 'test@gmail.com',
      password: 'super-secret',
    };
    describe('Signup [POST /signup]', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no credentials are provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(authDto)
          .expectStatus(201);
      });
    });
    describe('Signin [POST /signin]', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: authDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: authDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no credentials are provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(authDto)
          .expectStatus(200)
          .stores('userAt', 'access_token'); // stores('VarName', 'REQ_CONTEXT_KEY') store spec req/res data
      });
    });
  });

  describe('[Feature] User - /users', () => {
    describe('Get Me [Get /me]', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // 使用pactum cache userAt 變數
          })
          .expectStatus(200);
      });
    });

    describe('Edit user [PATCH /:id]', () => {
      const editUserDto: EditUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      it('should get current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}', // 使用pactum cache userAt 變數
          })
          .withBody(editUserDto)
          .expectStatus(200)
          .inspect();
      });
    });
  });

  describe('[Feature] Bookmarks - /bookmarks', () => {
    describe('Create bookmark [POST /]', () => {});

    describe('Get bookmarks [GET /]', () => {});

    describe('Get bookmark by id [GET /]', () => {});

    describe('Edit bookmark by id [PATCH /]', () => {});

    describe('Delete bookmark by id [DELETE /]', () => {});
  });
});
