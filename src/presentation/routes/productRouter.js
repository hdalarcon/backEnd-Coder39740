import { Router } from "express";
import { getAll, save, getOne, update, deleteOne } from "../controllers/productController.js";
import auth from "../middlewares/auth.js";
import authorization from "../middlewares/authorization.js";

const productRouter = Router();

productRouter.get('/', getAll);
productRouter.get('/:pid', getOne);
productRouter.post("/", auth, authorization('createProduct'), save)
productRouter.put("/:pid", auth, authorization('updateProduct'), update);
productRouter.delete("/:pid", auth, authorization('deleteProduct'), deleteOne);

export default productRouter;