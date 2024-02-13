import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'

test('list all devices', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        url: '/device'
    })

    const payload = JSON.parse(res.payload)
    assert.equal(res.statusCode, 200)
    assert.equal(payload.length, 3)
    assert.deepStrictEqual(payload[0], { id: 1, name: 'First Device', family_id: 1, address: '10.0.1.1' })
    assert.deepStrictEqual(payload[1], { id: 2, name: 'Second Device', family_id: 1, address: '10.0.1.2' })
    assert.deepStrictEqual(payload[2], { id: 3, name: 'Third Device', family_id: 2, address: '10.0.2.1' })
})

test('get device by id', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        url: '/device/123'
    })

    const payload = JSON.parse(res.payload)
    assert.equal(res.statusCode, 200)
    assert.deepStrictEqual(payload, { id: 123, name: 'Device 123', family_id: 1, address: '10.0.1.123' })
})

test('get device by id - 404', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        url: '/device/1404'
    })

    const payload = JSON.parse(res.payload)
    assert.equal(res.statusCode, 404)
    assert.deepStrictEqual(payload, { "statusCode": 404, "error": "Not Found", "message": "Not Found" })
})

test('create device', async (t) => {
    const app = await build(t)

    const res = await app.inject({
        url: '/device',
        method: 'POST',
        payload: {
            name: 'New Device Created',
            family_id: 1,
            address: '10.0.1.55'
        }
    })

    const payload = JSON.parse(res.payload)
    assert.equal(res.statusCode, 201)
    assert.ok(payload.id)
})