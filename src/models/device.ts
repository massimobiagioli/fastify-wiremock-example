export interface DeviceRequest {
  name: string
  type: string
  address: string
}

export type Device = DeviceRequest & {
  id: string
}

export interface GetDeviceByIdParams {
  id: string
}

export interface GetDeviceByIdError {
  error: string
}
