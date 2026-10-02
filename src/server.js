import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
    const app = express();

    const swaggerDocument = JSON.parse(readFileSync('./docs/swagger.json', 'utf-8'));

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/auth', authRouter);
    app.use('/contacts', contactsRouter);

    app.use('*splat', notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};