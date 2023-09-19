import { faker } from '@faker-js/faker';
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;
let jwt = "";

describe("Testing Auth Endpoints Success", () => {
    before(async function () {
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
    it('Creacion de cuenta /api/sessions/signup', function ()
    {
        this.timeout(5000);
        this.payload = {
            firstName: `${faker.person.firstName()} name`,
            lastName: `${faker.person.lastName()} Perez`,
            email: faker.internet.email(),
            age: 20,
            password: "12345678",
            isAdmin: false,
            role: "6507a0fa056f20d5185efca0"
        };

        return this.requester
            .post('/api/sessions/signup')
            .send(this.payload)
            .then(result =>
            {
                const { _body, status } = result;
                expect(status).to.be.equals(201);
                expect(_body.message).to.be.equals("User created.");
            }
        );
    });

    it('Login de cuenta /api/sessions/login', function ()
    {
        const payload = {
            email: this.payload.email,
            password: this.payload.password
        };

        return this.requester
            .post('/api/sessions/login')
            .send(payload)
            .then(result =>
            {
                const { _body, status } = result;

                expect(status).to.be.equals(200);
                expect(_body.message).to.be.equals("Login success!");

                jwt = _body.accessToken;
            }
        );
    });

    it('Current /api/sessions/current', function ()
    {
        const payload = {
            email: this.payload.email,
            password: this.payload.password
        };

        return this.requester
            .get('/api/sessions/current')
            .send(payload)
            .set('Authorization', `Bearer ${jwt}`)
            .then(result =>
            {
                const { _body, status } = result;
                expect(status).to.be.equals(200);
                expect(_body.payload.email).to.be.equals(this.payload.email);
            }
        );
    });
});
