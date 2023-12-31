import express from 'express';
import cookieParser from "cookie-parser";

import cartRouter from '../routes/cartRouter.js';
import productRouter from '../routes/productRouter.js';
import sessionRouter from '../routes/sessionRouter.js';
import userRouter from '../routes/userRouter.js';
import roleRouter from '../routes/roleRouter.js';
import loggerRouter from '../routes/loggerRouter.js';
import { addLogger } from '../../utils/logger.js';
import { addLoggerTest } from '../../utils/loggerTest.js';


import errorHandler from '../middlewares/errorHandler.js';

import swaggerUiExpress from 'swagger-ui-express';
import { specs } from '../../utils/swagger.js';

class AppExpress
{
    init()
    {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cookieParser());
        this.app.use(addLogger);
    }

    build()
    {
        this.app.use('/api/sessions', sessionRouter);
        this.app.use('/api/users', userRouter);
        this.app.use('/api/roles', roleRouter);
        this.app.use("/api/products", productRouter);
        this.app.use("/api/carts", cartRouter);
        this.app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
        this.app.use('/api/loggerTest', loggerRouter);
        this.app.use(errorHandler);
    }

    callback()
    {
        return this.app;
    }

    close()
    {
        this.server.close();
    }

    listen()
    {
        const port = process.env.PORT ?? 8080;
        return this.app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
      
    }
}

export default AppExpress;
