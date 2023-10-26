import request from 'supertest'
import app from '../../src/app'

describe('', () => {
  describe('Given all fields', () => {
    it('should return 201 status code', async () => {
      // Arrange
      const userData = {
        firstName: 'Shravan',
        lastName: 'Chaudhary',
        email: 'shravan@gmail.com',
        password: 'secret'
      }
      // Act
      const response = await request(app).post('/auth/register').send(userData)
      // Assert
      expect(response.statusCode).toBe(201)
    })

    it('should return valid json response', async () => {
      // Arrange
      const userData = {
        firstName: 'Shravan',
        lastName: 'Chaudhary',
        email: 'shravan@gmail.com',
        password: 'secret'
      }
      // Act
      const response = await request(app).post('/auth/register').send(userData)
      // Assert
      expect(
        (response.headers as Record<string, string>)['content-type']
      ).toEqual(expect.stringContaining('json'))
    })
  })

  // describe('Some fields are missing', () => {
  //   second
  // })
})
