import fp from 'fastify-plugin'
import { fetch } from 'undici'
import { Device, DeviceRequest } from '../models/device'

declare module 'fastify' {
  export interface FastifyInstance {
    deviceService: {
      getDevices: () => Promise<Device[]>
      getDeviceById: (id: string) => Promise<Device | null>
      createDevice: (device: DeviceRequest) => Promise<Device>
    }
  }
}

export default fp(async (fastify, opts) => {
  const SERVER_BASE_URL = `${fastify.config.DEVICE_SERVER_URL}/api/v1/device`

  const deviceService = {
    getDevices: async (): Promise<Device[]> => {
      const response = await fetch(SERVER_BASE_URL)
      return await response.json() as Device[]
    },
    getDeviceById: async (id: string): Promise<Device | null> => {
      const response = await fetch(`${SERVER_BASE_URL}/${id}`)
      if (response.status === 404) {
        return null
      }
      return await response.json() as Device
    },
    createDevice: async (device: DeviceRequest): Promise<Device> => {
      const response = await fetch(SERVER_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(device),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await (await response.json() as Promise<Device>)
    }
  }

  fastify.decorate('deviceService', deviceService)
})

