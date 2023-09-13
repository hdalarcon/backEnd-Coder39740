import { Router } from "express";
import { save, getOne, update, deleteProduct, updateProductsByCartId, updateProductByCartId, deleteCart, purchaseCart } from "../controllers/cartController.js";
import auth from "../middlewares/auth.js"

const cartRouter = Router();    

cartRouter.get("/:cid", auth, getOne);
cartRouter.post("/", auth, save);
cartRouter.post("/:cid/product/:pid", auth,update);
cartRouter.post('/:cid/purchase', auth, purchaseCart);
cartRouter.delete("/:cid/products/:pid", auth,deleteProduct);
cartRouter.delete("/:cid", auth,deleteCart);
cartRouter.put("/:cid", auth,updateProductsByCartId);
cartRouter.put("/:cid/product/:pid", auth,updateProductByCartId);

export default cartRouter;
