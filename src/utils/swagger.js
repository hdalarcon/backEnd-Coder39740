import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación API Ecommerce',
            description: 'API de Ecommerce para CoderHouse'
        }
    },

    apis: ['./src/docs/**/*.yaml']
}

export const specs = swaggerJsdoc(swaggerOptions);