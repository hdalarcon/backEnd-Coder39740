import { Router } from "express";
import { save, getOne, update, deleteProduct, updateProductsByCartId, updateProductByCartId, deleteCart, purchaseCart } from "../controllers/cartController.js";
import auth from "../middlewares/auth.js"
import authorization from "../middlewares/authorization.js"

const cartRouter = Router();    

cartRouter.get("/:cid", auth, authorization('getCart'), getOne);
cartRouter.post("/", auth, save);
cartRouter.post("/:cid/product/:pid", auth, authorization('postProdCart'),update);
cartRouter.post('/:cid/purchase', auth, authorization('purchase'), purchaseCart);
cartRouter.delete("/:cid/products/:pid", auth,authorization('deleteProdCart'), deleteProduct);
cartRouter.delete("/:cid", auth, authorization('deleteAllProdCart'), deleteCart);
cartRouter.put("/:cid", auth, authorization('updateCart'), updateProductsByCartId);
cartRouter.put("/:cid/product/:pid", auth, authorization('putProdCart'), updateProductByCartId);

export default cartRouter;
