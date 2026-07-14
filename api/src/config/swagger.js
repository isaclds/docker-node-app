import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portifolio API",
      version: "1.0.0",
      description: "A simple CRUD API documented with Swagger",
    },
    servers: [
      {
        url: `http://localhost:8080/api`,
        description: "Docker development server",
      },
      {
        url: `http://localhost:3000/`,
        description: "Development server without docker",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "../docs/*.yaml")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
