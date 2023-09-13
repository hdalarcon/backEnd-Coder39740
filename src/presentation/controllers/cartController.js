import CartManager from "../../domain/manager/cartManager.js";
import ProductManager from "../../domain/manager/productManager.js";
import TicketManager from "../../domain/manager/ticketManager.js";
import EmailManager from "../../domain/manager/emailManager.js";
import { v4 as uuidv4 } from 'uuid';

export const getOne = async (req,res)=>{
    try {
        const { cid } = req.params;
        const manager = new CartManager();
        const cart = await manager.getOne(cid);
        res.send({ status: 'success', cart });
    } catch (error) {
        res.status(400).send({error: error.message});
    }
};

export const save = async (req,res)=>{
    try {
        const manager =  new CartManager();
        const cart = await manager.create(req.body);
        res.send({ status: 'success', cart, message: 'Cart created.' })
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const update = async(req,res)=>{
    try {
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const cart = await manager.updateOne(cid, pid);
        res.send({ status: 'success', cart, message: 'Cart updated.' });
    } catch (error) {
        res.status(404).send({error: error});
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const result = await manager.deleteProduct(cid, pid);
        res.send({status: 'success',msg:'Item deleted successfully',result});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const deleteOne = async(req,res)=>{
    try {
        const { id } = req.params;
        const manager = new CartManager();
        const cart = await manager.deleteOne(id);
        res.send({ status: 'success', cart, message: 'Product deleted.' })
    } catch (error) {
        res.status(404).send({error: error});
    }
};

export const deleteCart = async (req , res) => {
    try {
        const { cid } = req.params;
        const manager = new CartManager();
        const result = await manager.delete(cid);
        res.send({status: 'success',msg:'Cart deleted',result});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

export const updateProductsByCartId = async (req, res) => {
    try {
        const { body } = req;
        const { cid } = req.params;
        const manager = new CartManager();
        const result = await manager.updateProducts(body, cid);
        res.send({status: 'sucess',msg:'Cart updated',result});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const updateProductByCartId = async (req, res) => {
    try {
        const { body } = req;
        const { cid, pid } = req.params;
        const manager = new CartManager();
        const result = await manager.updateProductByCartId(body, cid, pid);
        res.send({status: 'success',msg:'Product updated',result});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
export const purchaseCart = async(req, res, next) =>
{
    try
    {
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
    catch (e)
{
        next(e);
    }
};

