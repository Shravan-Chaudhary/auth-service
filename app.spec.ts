import request from 'supertest'
import { calculateDiscountedPrice } from './src/utils'
import app from './src/app'

describe.skip('App', () => {
  it('should calculate the discount', () => {
    const result = calculateDiscountedPrice(100, 10)
    expect(result).toBe(90)
  })

  it('should return 200 status', async () => {
    const response = await request(app).get('/').send()
    expect(response.statusCode).toBe(200)
  })
})
