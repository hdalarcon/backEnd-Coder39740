import ProductManager from "../../domain/manager/productManager.js";
import { v4 as uuidv4 } from 'uuid';

export const getAll = async  (req, res, next) =>
{   
    try {
        req.logger.debug('product controller: get all');
        const { limit, page, sort } = req.query;

        let query = {}
        if(req.query.category || req.query.status) query = req.query
        const manager = new ProductManager();
        const products = await manager.paginate({ query, limit, page, sort });
        res.status(200).send({ status: 'success', message: 'All products', products: products.docs, ...products, docs: undefined });
    } catch (error) {
        next(error);
    }
};


export const save = async (req,res, next)=>{
    try {
        req.logger.debug('product controller: create product');
        const body = req.body;
        body.code= uuidv4();
        if(req.user.role.name === 'premium')
        {
            body.owner= req.user.email;
        }
        
        const manager =  new ProductManager();
        const product = await manager.create(body);
        
        res.status(201).send({ result: 'success', payload: product, message: 'Product created.' })
    } catch (error) {
        next(error);
    }
};

export const getOne = async (req,res,next)=>{
    try {
        req.logger.debug('product controller: get one');
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.getOne(pid);

        res.status(201).send({ result: 'success', message: `Product with Id: ${pid} found`, payload: product });
    } catch (error) {
        next(error);
    }
};


export const update = async(req,res,next)=>{
    try {
        req.logger.debug('product controller: update one product');
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.updateOne(pid,req.body);
        res.send({ status: 'success', product, message: 'Product updated.' });
    } catch (error) {
        next(error);
    }
};

export const deleteOne = async(req,res,next)=>{
    try {
        req.logger.debug('product controller: delete one');
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.deleteOne(pid);
        res.send({ status: 'success', product, message: 'Product deleted.' })
    } catch (error) {
        next(error);
    }
};

