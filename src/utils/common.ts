import * as jose from 'jose';
import crypto from 'crypto';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { isGenre } from '../types/genre.type.js';
import { Movie } from '../types/movie.type.js';
import { ValidationError } from 'class-validator';
import { PropertyValidationError } from '../types/property-validation-error.type.js';
import { ServiceError } from '../types/service-error.enum.js';
import { DEFAULT_STATIC_FILES } from '../app/application.constant.js';

export function createMovie(str: string): Movie {
  const values = str.replace('\n', '').split('\t');

  if (values.length !== 16) {
    throw new Error('Строка содержит неверное число значений');
  }

  const [
    title,
    description,
    publicationDate,
    genre,
    releaseYear,
    videoPreviewUri,
    videoUri,
    cast,
    producer,
    duration,
    userName,
    userAvatarUri,
    userEmail,
    posterUri,
    backgroundImageUri,
    backgroundColor,
  ] = values;

  if (!isGenre(genre)) {
    throw new Error('Параметр genre должен иметь тип Genre');
  }

  return {
    title,
    description,
    publicationDate: new Date(publicationDate),
    genre: genre,
    releaseYear: parseInt(releaseYear, 10),
    rating: 0,
    videoPreviewUri,
    videoUri,
    cast: cast.split(','),
    producer,
    duration: parseInt(duration, 10),
    commentAmount: 0,
    user: {
      name: userName,
      avatarUri: userAvatarUri,
      email: userEmail,
    },
    posterUri,
    backgroundImageUri,
    backgroundColor,
  };
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : `${error}`;
}

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V[]): T[];
export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V): T;
export function fillDto<T, V>(someDto: ClassConstructor<T>, plainObject: V[] | V): T[] | T {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
}

export const createErrorObject = (
  serviceError: ServiceError,
  message: string,
  details: PropertyValidationError[] = []
) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (
  algorithm: string,
  jwtSecret: string,
  payload: object
): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
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
  transformFn: (value: unknown) => unknown
) => {
  Object.keys(object)
    .forEach((key) => {
      const value = object[key];
      if (key === property) {
        object[key] = transformFn(value);
        return;
      }
      if (isObject(value)) {
        transformProperty(property, value, transformFn);
      }
    });
};

export const transformPathesInObject = (
  properties: string[],
  staticPath: string,
  uploadPath: string,
  object: Record<string, unknown>
) => {
  properties
    .forEach((property) => transformProperty(property, object, (value) => {
      if (typeof value !== 'string') {
        throw new Error(`Ожидалось, что значение поля ${property} будет строкой`);
      }
      const rootPath = DEFAULT_STATIC_FILES.includes(value) ? staticPath : uploadPath;
      return `${rootPath}/${value}`;
    }));
};
