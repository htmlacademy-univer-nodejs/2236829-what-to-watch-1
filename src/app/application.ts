import 'reflect-metadata';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { inject, injectable } from 'inversify';
import express, { Express, NextFunction, Request, Response } from 'express';
import { Component } from '../types/component.type.js';
import { getMongoDbURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenticate.middleware.js';
import { getFullServerPath } from '../utils/common.js';
import cors from 'cors';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface)
    private logger: LoggerInterface,
    @inject(Component.ConfigInterface)
    private config: ConfigInterface,
    @inject(Component.DatabaseInterface)
    private databaseClient: DatabaseInterface,
    @inject(Component.MovieController)
    private movieController: ControllerInterface,
    @inject(Component.WatchLaterController)
    private watchLaterController: ControllerInterface,
    @inject(Component.UserController)
    private userController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface)
    private exceptionFilter: ExceptionFilterInterface,
  ) {
    this.expressApp = express();
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY_PATH'))
    );
    this.expressApp.use(
      '/static',
      express.static(this.config.get('STATIC_DIRECTORY_PATH'))
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  public initExceptionFilters() {
    this.expressApp.use(
      (err: Error, req: Request, res: Response, next: NextFunction) =>
        this.exceptionFilter.catch(err, req, res, next)
    );
  }

  public initRoutes() {
    this.expressApp.use('/movies', this.movieController.router);
    this.expressApp.use('/watch-later', this.watchLaterController.router);
    this.expressApp.use('/users', this.userController.router);
  }

  public async init() {
    this.logger.info('Инициализация приложения…');
    const port = this.config.get('PORT');
    this.logger.info(`Значение переменной $PORT: ${port}`);

    const uri = getMongoDbURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(port, () => this.logger.info(`Сервер запущен на ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`));
  }
}
