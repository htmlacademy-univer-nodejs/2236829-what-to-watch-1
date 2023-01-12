import * as jose from 'jose';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { isGenre } from '../types/genre.type.js';
import { Movie } from '../types/movie.type.js';
import { ValidationError } from 'class-validator';
import { PropertyValidationError } from '../types/property-validation-error.type.js';
import { ServiceError } from '../types/service-error.enum.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';

export function createMovie(str: string): Movie {
  const [
    title,
    description,
    publicationDate,
    genre,
    releaseYear,
    rating,
    videoPreviewUri,
    videoUri,
    cast,
    producer,
    duration,
    commentAmount,
    userName,
    userAvatarUri,
    userEmail,
    userPassword,
    posterUri,
    backgroundImageUri,
    backgroundColor,
  ] = str.split('\t');

  if (typeof backgroundColor === 'undefined') {
    throw new Error('Строка содержит недостаточно значений');
  }

  if (!isGenre(genre)) {
    throw new Error('Параметр genre должен иметь тип Genre');
  }

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: genre,
    releaseYear: parseInt(releaseYear, 10),
    rating: parseFloat(rating),
    videoPreviewUri,
    videoUri,
    cast: cast.split(','),
    producer,
    duration: parseInt(duration, 10),
    commentAmount: parseInt(commentAmount, 10),
    user: {
      name: userName,
      avatarUri: userAvatarUri,
      email: userEmail,
      password: userPassword,
    },
    posterUri,
    backgroundImageUri,
    backgroundColor,
  };
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDto = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: PropertyValidationError[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): PropertyValidationError[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  object: Record<string, unknown>,
  transformFn: (key: string, value: unknown) => unknown
) => {
  Object.keys(object)
    .forEach((key) => {
      const value = object[key];
      if (key === property) {
        object[key] = transformFn(key, value);
        return;
      }
      if (isObject(value)) {
        transformProperty(property, value, transformFn);
      }
    });
};

export const transformPathesInObject = (
    properties: string[], staticPath: string, uploadPath: string, object: Record<string, unknown>
  ) => {
  properties
    .forEach((property) => transformProperty(property, object, (_, value) => {
      if (typeof value !== 'string') {
        return value;
      }
      const rootPath = DEFAULT_STATIC_IMAGES.includes(value) ? staticPath : uploadPath;
      return `${rootPath}/${value}`;
    }));
};
