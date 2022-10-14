import convict from 'convict';

export type ConfigSchema = {
  PORT: number;
};

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Порт для входящих соединений',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
});
