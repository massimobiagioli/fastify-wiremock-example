import { join } from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import FastifyEnv from '@fastify/env'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      DEVICE_SERVER_URL: string;
    };
  }
}

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {
}

const options: AppOptions = {
}

const FastifyEnvOpts = {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['DEVICE_SERVER_URL'],
    properties: {
      DEVICE_SERVER_URL: {
        type: 'string'
      }
    }
  }
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(FastifyEnv, FastifyEnvOpts)

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
