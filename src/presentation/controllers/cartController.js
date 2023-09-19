import CartManager from "../../domain/manager/cartManager.js";
import ProductManager from "../../domain/manager/productManager.js";
import TicketManager from "../../domain/manager/ticketManager.js";
import EmailManager from "../../domain/manager/emailManager.js";
import { v4 as uuidv4 } from 'uuid';

export const getOne = async (req,res,next)=>{
    try {
        req.logger.debug('cart controller: one cart');
        const { cid } = req.params;
        const manager = new CartManager();
        const cart = await manager.getOne(cid);
        res.send({ status: 'success', cart });
    } catch (error) {
        next(error);
    }
};

export const save = async (req,res,next)=>{
    try {
        req.logger.debug('cart controller: new cart');
        const manager =  new CartManager();
        const cart = await manager.create(req.body);
        res.send({ status: 'success', cart, message: 'Cart created.' })
    } catch (error) {
        next(error);
    }
};

export const update = async(req,res,next)=>{
    try {
        req.logger.debug('cart controller: update cart');
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const cart = await manager.updateOne(cid, pid);
        res.send({ status: 'success', cart, message: 'Cart updated.' });
    } catch (error) {
        next(error);
        //res.status(404).send({error: error});
    }
};

export const deleteProduct = async (req, res,next) => {
    try {
        req.logger.debug('cart controller: delete especific product in cart');
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const result = await manager.deleteProduct(cid, pid);
        res.send({status: 'success',msg:'Item deleted successfully',result});
    } catch (error) {
        next(error);
    }
};

export const deleteOne = async(req,res,next)=>{
    try {
        req.logger.debug('cart controller: delete especific product in cart');
        const { id } = req.params;
        const manager = new CartManager();
        const cart = await manager.deleteOne(id);
        res.send({ status: 'success', cart, message: 'Product deleted.' })
    } catch (error) {
        next(error);
    }
};

export const deleteCart = async (req , res,next) => {
    try {
        req.logger.debug('cart controller: delete all products in cart');
        const { cid } = req.params;
        const manager = new CartManager();
        const result = await manager.delete(cid);
        res.send({status: 'success',msg:'Cart deleted',result});
    } catch (error) {
        next(error);
    }
}

export const updateProductsByCartId = async (req, res,next) => {
    try {
        req.logger.debug('cart controller: update cart');
        const { body } = req;
        const { cid } = req.params;
        const manager = new CartManager();
        const result = await manager.updateProducts(body, cid);
        res.send({status: 'sucess',msg:'Cart updated',result});
    } catch (error) {
        next(error);
    }
};

export const updateProductByCartId = async (req, res,next) => {
    try {
        req.logger.debug('cart controller: especific product updated in cart');
        const { body } = req;
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const result = await manager.updateProductByCartId(body, cid, pid);
        res.send({status: 'success',msg:'Product updated',result});
    } catch (error) {
        next(error);
    }
};
export const purchaseCart = async(req, res, next) =>
{
    try
    {
        req.logger.debug('cart controller: buy products in cart');
        const cid = req.params.cid;

        const product = new ProductManager();
        const manager = new CartManager();

        const getProdInCart = await manager.purchaseProd(cid);
            
        const prodInCartInfo = getProdInCart.products;

        let amount = 0;

        for (let i = 0; i < prodInCartInfo.length; i++)
        {
            const idProd = prodInCartInfo[i].id.toString();
            const quantityProd = prodInCartInfo[i].quantity;
            const completeProductInfo = await product.getOne(idProd);

            const stockControl = completeProductInfo.stock - quantityProd;

            if (stockControl < 0)
            {
                continue;
            }

            const dto = {
                ...completeProductInfo,
                stock: stockControl
            };
            const modifProduct = await product.updateOne(idProd, dto);

            const subTotal = completeProductInfo.price * quantityProd;
            amount += subTotal;
        }

        const dtoTicket = {
            purchaseDateTime: new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
            amount,
            purchaser: req.user.email
        };
        dtoTicket.code = uuidv4();

        const ticket = new TicketManager();
        const newTicket = await ticket.createNewTicket(dtoTicket);

        const ticketString = JSON.stringify(newTicket, null, 2);

        const userEmail = req.user.email;
        const emailManager = new EmailManager();
        await emailManager.emailTicket(ticketString, userEmail);

        await manager.delete(cid);

        res.status(201).send({
            message: 'Products purchased successfully',
            Ticket: newTicket
        });
    }
    catch (error)
    {   
        next(error);
    }
};

