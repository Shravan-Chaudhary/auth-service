# Authentication Microservice 🔐

This is an authentication microservice offering advanced, multi-tenant authentication capabilities, built with Express and TypeScript.

## Tech Stack

- **Framework:** [Express](https://expressjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **User Management:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [JWT](https://jwt.io/)
- **Validation:** [Express Validator](https://express-validator.github.io/docs/)
- **Tests:** [Jest](https://jestjs.io/)
- **Containerization:** [Docker](https://www.docker.com/)
- **Code Analysis:** [SonarCloud](https://sonarcloud.io/)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)

## Features to Implement

- [x] **Persist User:** Store user data in a database using TypeORM.
- [x] **Authentication:** Implement token-based authentication using JSON Web Tokens.
- [x] **Access and Refresh Tokens:** Implement a system for issuing and refreshing access tokens.
- [x] **Validation:** Use Express Validator to validate user input.
- [x] **Tests:** Write unit and integration tests using Jest.
- [x] **Docker:** Containerize the service using Docker for easy deployment and scaling.
- [x] **Middleware:** Implement custom middleware for handling requests and responses.
- [ ] **Refresh Token Rotation:** Implement a secure refresh token rotation strategy to enhance security.
- [ ] **Multi-Tenancy:** Support for multi-tenancy to allow the service to be used by multiple clients.
- [ ] **GitHub Actions:** Set up CI/CD pipelines using GitHub Actions.
- [ ] **Code Analysis:** Use tools like ESLint and Prettier for code formatting and analysis.

## Getting Started

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

### Clone this repository

```bash
$ git clone https://github.com/yourusername/your-repo-name.git
```

### Go into the repository

```bash
$ cd your-repo-name
```

### Install dependencies

```bash
$ npm install
```

### Run the app

```bash
$ npm start
```

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## License

This project is licensed under the terms of the [MIT license](LICENSE.md).
