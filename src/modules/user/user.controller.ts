import { Controller } from '../../common/controller/controller.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.type.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { Request, Response } from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../common/errors/http-error.js';
import { UserServiceInterface } from './user-service.interface.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { StatusCodes } from 'http-status-codes';
import { createJWT, fillDto } from '../../utils/common.js';
import UserDto from './dto/user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidationError } from 'class-validator';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { JWT_ALGORITM } from './user.constant.js';
import LoggedUserDto from './dto/logged-user.dto.js';
import { AuthorizeMiddleware } from '../../common/middlewares/authorize.middleware.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface)
    private readonly configService: ConfigInterface,
    @inject(Component.LoggerInterface)
    logger: LoggerInterface,
  ) {
    super(logger);
    this.logger.info('Регистрация эндпоинтов для UserController…');

    const validateUserDtoMiddleware = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginDtoMiddleware = new ValidateDtoMiddleware(LoginUserDto);
    const authorizationMiddleware = new AuthorizeMiddleware();

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [validateUserDtoMiddleware]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [validateLoginDtoMiddleware]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.getCurrentUser,
      middlewares: [authorizationMiddleware]
    });

    this.addRoute({
      path: '/:id/avatar',
      method: HttpMethod.Put,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    req: Request<Record<string, unknown>, ValidationError[], CreateUserDto>,
    res: Response<ValidationError[]>,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(req.body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Пользователь с почтой «${req.body.email}» уже существует.`,
        'UserController'
      );
    }

    const result = await this.userService.create(req.body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDto(UserDto, result)
    );
  }

  public async login(
    req: Request<Record<string, unknown>, LoggedUserDto | ValidationError[], LoginUserDto>,
    res: Response<LoggedUserDto | ValidationError[]>
  ): Promise<void> {
    const user = await this.userService.verifyUser(req.body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res, fillDto(LoggedUserDto, {email: user.email, token}));
  }

  public async getCurrentUser(
    req: Request<Record<string, unknown>, LoggedUserDto>,
    res: Response<LoggedUserDto>
  ): Promise<void> {
    const user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Пользователь не найден',
        'UserController',
      );
    }

    this.ok(res, fillDto(LoggedUserDto, user));
  }

  public async uploadAvatar(req: Request<{id: string}>, res: Response) {
    this.created(res, { filepath: req.file?.path });
  }
}
