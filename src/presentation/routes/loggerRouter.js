import { Router } from 'express';
import { getLogger } from '../controllers/loggerController.js';

const loggerRouter = Router();

loggerRouter.get('/', getLogger);

export default loggerRouter;
