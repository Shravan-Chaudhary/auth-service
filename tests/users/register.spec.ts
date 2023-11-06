import request from 'supertest'
import app from '../../src/app'
import { AppDataSource } from '../../src/config/data-source'
import { DataSource } from 'typeorm'
import { User } from '../../src/entity/User'
import { Roles } from '../../src/constants'

describe('', () => {
  let connection: DataSource

  beforeAll(async () => {
    connection = await AppDataSource.initialize()
  })

  beforeEach(async () => {
    // Database Truncate
    await connection.dropDatabase()
    await connection.synchronize()
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
      expect((response.headers as Record<string, string>)['content-type']).toEqual(expect.stringContaining('json'))
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

    it('should return id of created user', async () => {
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
      expect(response.body).toHaveProperty('id')
    })

    it('should assign customer role', async () => {
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
      expect(users[0]).toHaveProperty('role')
      expect(users[0].role).toBe(Roles.CUSTOMER)
    })

    it('should store hashed password', async () => {
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
      expect(users[0].password).not.toBe(userData.password)
      expect(users[0].password).toHaveLength(60)
      expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
    })
  })

  // describe('Some fields are missing', () => {
  //   second
  // })
})
