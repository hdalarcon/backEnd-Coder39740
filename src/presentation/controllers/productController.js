import ProductManager from "../../domain/manager/productManager.js";
import { v4 as uuidv4 } from 'uuid';

export const getAll = async  (req, res) =>
{   
    try {
        const { limit, page, sort } = req.query;

        let query = {}
        if(req.query.category || req.query.status) query = req.query
        const manager = new ProductManager();
        const products = await manager.paginate({ query, limit, page, sort });
        res.send({ status: 'success', products: products.docs, ...products, docs: undefined });
    } catch (error) {
        res.status(400).send({message: 'Error al recuperar los productos.'});
    }
};


export const save = async (req,res)=>{
    try {

        const body = req.body;
        body.code= uuidv4();
        body.owner= req.user.email;
        
        const manager =  new ProductManager();
        const product = await manager.create(body);
        res.send({ status: 'success', product, message: 'Product created.' })
    } catch (error) {
        res.status(400).send({message: 'Error al crear el producto.'});
    }
};

export const getOne = async (req,res)=>{
    try {
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.getOne(pid);

        res.send({ status: 'success', product });
    } catch (error) {
        res.status(404).send({error: error.message});
    }
};


export const update = async(req,res)=>{
    try {
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.updateOne(pid,req.body);
        res.send({ status: 'success', product, message: 'Product updated.' });
    } catch (error) {
        res.status(404).send({message: `Error al querer actualizar el producto.`});
    }
};

export const deleteOne = async(req,res)=>{
    try {
        const { pid } = req.params;
        const manager = new ProductManager();
        const product = await manager.deleteOne(pid);
        res.send({ status: 'success', product, message: 'Product deleted.' })
    } catch (error) {
        res.status(404).send({error: error});
    }
};

