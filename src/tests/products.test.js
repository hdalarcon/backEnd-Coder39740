import { faker } from '@faker-js/faker';
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";
import { v4 as uuidv4 } from 'uuid';

const expect = chai.expect;
let jwt = "";

describe('Test endpoint Product', () =>{
    before(async function() {
        const { app, db } = await initServer();
        const application = app.callback();
        this.requester = supertest.agent(application);
        this.app = app;
        this.db = db;
        this.payload = {};
    });
    after(function () {
        this.db.close();
        this.requester.app.close(() => {
          console.log('Conexión cerrada');
        });
    });
    beforeEach(async function () {
        this.timeout(2000);
        await new Promise(resolve => setTimeout(resolve, 500));
    });
    it('Test login para obtener credenciales', function()
    {
        this.timeout(2000);
        const user = {
            email: 'hdalarcon@gmail.com',
            password: '654321a' };

        return this.requester
            .post('/api/sessions/login')
            .send(user)
            .then(result =>
            {
                jwt = result._body.accessToken;
            });
    });
    it('Test create product', function()
    {

        const payload = {
            title: "Producto remera usuario Test",
            description: "Remera azul rayada.",
            price: 9500,
            status: true,
            stock: 25,
            code: uuidv4(),
            category: "Remeras",
            thumbnail: "Sin imagen."
        };

        return this.requester
            .post('/api/products')
            .set('Authorization', `Bearer ${jwt}`)
            .send(payload)
            .then(result =>
            {
                //const { _body, status } = result;

                expect(result.status).to.be.equals(201);
                // expect(result._body.result).to.be.equals('success');
                // expect(result._body.message).to.be.equals('Product created.');
            });
    });
    it('Test buscar un producto /api/products/:pid', function()
    {
        this.timeout(5000);
        const pid = '6508dc10ae2ff3cf57b1a719';
        return this.requester
            .get(`/api/products/${pid}`)
            .send(pid)
            .then(result =>
            {
                const { status, _body } = result;
                expect(status).to.be.equal(201);
                expect(_body).to.has.a.property('message').to.be.a('string');
                expect(_body.message).to.includes('Product with Id:');
                expect(_body.payload).to.has.a.property('title').to.be.a('string');
                expect(_body.payload).to.has.a.property('price').to.be.a('number');
            });
    });
    it('Test update product /api/products/:pid', function()
    {
        this.timeout(5000);
        this.payload = {
            title: faker.lorem.lines(1),
            description: faker.lorem.lines(2),
            price: faker.number.int({ min:150000, max:300000 }),
            thumbnail: faker.image.url(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min:2, max:15 }),
            category: 'Remeras'
        };

        return this.requester
            .post('/api/products')
            .set('Authorization', `Bearer ${jwt}`)
            .send(this.payload)
            .then(response =>
            {
                const dtoUpdate = {
                    title: faker.lorem.lines(1),
                    description: faker.lorem.lines(2),
                    price: faker.number.int({ min:150000, max:300000 }),
                    thumbnail: faker.image.url(),
                    code: faker.string.uuid(),
                    stock: faker.number.int({ min:2, max:15 }),
                    category: 'Remeras'
                };
            const idProd = response._body.payload.id;
            this.requester
                .put(`/api/products/${idProd}`)
                .set('Authorization', `Bearer ${jwt}`)
                .send(dtoUpdate)
                .then(res =>
                {
                    const { status, _body } = res;
                    expect(status).to.be.equals(200);
                    expect(_body).to.be.an('object');
                    expect(_body.result).to.be.equals('success');
                    expect(_body.message).to.be.equals('Product updated');
                    expect(_body.payload).to.has.a.property('price').to.be.a('number');
                });
        });
    });
    it('Testeo delete product /api/products/:pid', function()
    {
        this.timeout(5000);
        this.payload = {
            title: faker.lorem.lines(1),
            description: faker.lorem.lines(2),
            price: faker.number.int({ min:150000, max:300000 }),
            thumbnail: faker.image.url(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min:2, max:15 }),
            category: 'l'
        };

        return this.requester
            .post('/api/products')
            .set('Authorization', `Bearer ${jwt}`)
            .send(this.payload)
            .then(response =>
            {
                const idProd = response._body.payload.id;
                this.requester
                .delete(`/api/products/${idProd}`)
                .set('Authorization', `Bearer ${jwt}`)
                .then(res =>
                {
                    expect(res.statusCode).to.be.equal(204);
                });
            });
    });
    it('Test list products /api/products', function()
    {
        this.timeout(10000);
        return this.requester
            .get('/api/products')
            .then(result =>
            {
                expect(result.status).to.be.equal(200);
                expect(result._body.message).to.be.equals('All products');
                expect(result._body.status).to.be.equals('success');
            });
    });
});


describe('Test endpoint Product Fail', () =>
{
    before(async function() {
        this.payload = {};
        const { app, db } = await initServer();
        const application = app.callback();
        this.requester = supertest.agent(application);
        this.app = app;
        this.db = db;
        this.payload = {};
    });
    after(function () {
        this.db.close();
        this.requester.app.close(() => {
          console.log('Conexión cerrada');
        });
    });
    beforeEach(async function () {
        this.timeout(2000);
        await new Promise(resolve => setTimeout(resolve, 500));
    });
    it('Test login para obtener credenciales fail', function()
    {
        this.timeout(5000);
        const user = {
            email: 'hdalarcon@gmail.com',
            password: '654321' };

        return this.requester
            .post('/api/sessions/login')
            .send(user)
            .then(result =>
            {
                jwt = result._body.accessToken;
            });
    });
    it('Test buscar un producto con id incorrecto /api/products/:pid fail', function()
    {
        this.timeout(5000);
        const pid = '6508d9c233613660d646b3b0';
        return this.requester
            .get(`/api/products/${pid}`)
            .send(pid)
            .then(result =>
            {
                const { status } = result;
                expect(status).to.be.equal(500);
            });
    });
    it('Test creacion de producto sin credenciales /api/products', function()
    {
        this.timeout(5000);
        const payload = {
            title: faker.lorem.lines(1),
            description: faker.lorem.lines(2),
            price: faker.number.int({ min:1000, max:99999 }),
            thumbnail: faker.image.url(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min:2, max:15 }),
            category: 'Remeras'
        };

        return this.requester
            .post('/api/products')
            .set('Authorization', `Bearer ${jwt}`)
            .send(payload)
            .then(response =>
            {
                expect(response.status).to.be.equals(403);
            });
    });
    it('Test actualizacion de producto sin credenciales /api/products/:pid', function()
    {
        this.timeout(5000);
        const pid = '6508d9c233613660d646b3b1';
        this.payload = {
            title: faker.lorem.lines(1),
            description: faker.lorem.lines(2),
            price: faker.number.int({ min:150000, max:300000 }),
            thumbnail: faker.image.url(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min:2, max:15 }),
            category: 'Remeras'
        };

        return this.requester
            .put(`/api/products/${pid}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send(this.payload)
            .then(response =>
            {
                expect(response.status).to.be.equal(403);
            });
    });
    it('Test delete de producto sin credenciales /api/products/:pid', function()
    {
        this.timeout(5000);
        const pid = '6508d9c233613660d646b3b0';

        return this.requester
            .delete(`/api/products/${pid}`)
            .set('Authorization', `Bearer ${jwt}`)
            .then(response =>
            {
                expect(response.status).to.be.equal(403);
            });
    });
});