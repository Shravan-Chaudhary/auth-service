import request from 'supertest'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import { User } from '../../src/entity/User'
import { truncateTables } from '../utils'

describe('', () => {
  let connection: DataSource

  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    // Database Truncate
    await truncateTables(connection)
  })

  afterAll(async () => {
    await connection.destroy()
  })

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

    it('should persist use in database', async () => {
      // Arrange
      const userData = {
        firstName: 'Shravan',
        lastName: 'Chaudhary',
        email: 'shravan@gmail.com',
        password: 'secret'
      }
      // Act
      await request(app).post('/auth/register').send(userData)

      // Assert
      const userRepository = connection.getRepository(User)
      const users = await userRepository.find()
      expect(users).toHaveLength(1)
      expect(users[0].firstName).toBe(userData.firstName) // Shravan
      expect(users[0].lastName).toBe(userData.lastName) // Chaudhary
      expect(users[0].email).toBe(userData.email) // shravan@gmail
    })
  })

  // describe('Some fields are missing', () => {
  //   second
  // })
})
