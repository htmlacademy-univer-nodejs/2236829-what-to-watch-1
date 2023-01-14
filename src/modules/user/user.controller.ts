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
import ValidationError from '../../common/errors/validation-error.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { JWT_ALGORITM } from './user.constant.js';
import LoggedUserDto from './dto/logged-user.dto.js';
import { AuthorizeMiddleware } from '../../common/middlewares/authorize.middleware.js';
import UploadAvatarDto from './dto/upload-avatar.dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface)
    configService: ConfigInterface,
    @inject(Component.LoggerInterface)
    logger: LoggerInterface,
  ) {
    super(logger, configService);
    this.logger.info('Регистрация эндпоинтов для UserController…');

    const validateUserDtoMiddleware = new ValidateDtoMiddleware(CreateUserDto);
    const validateLoginDtoMiddleware = new ValidateDtoMiddleware(LoginUserDto);
    const authorizationMiddleware = new AuthorizeMiddleware();
    const uploadAvatarMiddleware = new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY_PATH'), 'avatar');

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
      path: '/login/avatar',
      method: HttpMethod.Put,
      handler: this.uploadAvatar,
      middlewares: [
        authorizationMiddleware,
        uploadAvatarMiddleware,
      ]
    });
  }

  public async create(
    req: Request<Record<string, unknown>, UserDto | ValidationError[], CreateUserDto>,
    res: Response<UserDto | ValidationError[]>,
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

    this.ok(res, fillDto(LoggedUserDto, {...user, token}));
  }

  public async getCurrentUser(
    req: Request<Record<string, unknown>, UserDto>,
    res: Response<UserDto>
  ): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const user = await this.userService.findByEmail(req.user.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Пользователь не найден',
        'UserController',
      );
    }

    this.ok(res, fillDto(UserDto, user));
  }

  public async uploadAvatar(
    req: Request<Record<string, unknown>, UploadAvatarDto>,
    res: Response<UploadAvatarDto>
  ): Promise<void> {
    const fileUri = req.file?.filename;
    if (!fileUri) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Изображение не загружено',
        'UserController',
      );
    }
    const uploadFile = {avatarUri: fileUri};
    await this.userService.updateAvatar(req.user.id, uploadFile);
    this.created(res, fillDto(UploadAvatarDto, uploadFile));
  }
}
