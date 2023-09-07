import { Router } from "express";
import { save, getOne, update, deleteProduct, updateProductsByCartId, updateProductByCartId, deleteCart, purchaseCart } from "../controllers/cartController.js";
import auth from "../middlewares/auth.js"

const cartRouter = Router();    

cartRouter.get("/:cid", getOne);
cartRouter.post("/", save);
cartRouter.post("/:cid/product/:pid",update);
cartRouter.post('/:cid/purchase', auth, purchaseCart);
cartRouter.delete("/:cid/products/:pid", deleteProduct);
cartRouter.delete("/:cid", deleteCart);
cartRouter.put("/:cid", updateProductsByCartId);
cartRouter.put("/:cid/product/:pid", updateProductByCartId);

export default cartRouter;
