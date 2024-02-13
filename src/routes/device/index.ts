import { FastifyPluginAsync } from 'fastify'
import { Device, DeviceRequest, GetDeviceByIdError, GetDeviceByIdParams } from '../../models/device'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Reply: Device[] }>('/', async function (request, reply) {
    return await fastify.deviceService.getDevices()
  })

  fastify.get<{ Params: GetDeviceByIdParams, Reply: Device | GetDeviceByIdError }>('/:id', async function (request, reply) {
    const result = await fastify.deviceService.getDeviceById(request.params.id)
    if (result === null) {
      return await reply.notFound()
    }
    return result
  })

  fastify.post<{ Body: DeviceRequest, Reply: Device }>('/', async function (request, reply) {
    const result = await fastify.deviceService.createDevice(request.body)
    return reply.code(201).send(result)
  })
}

export default root
