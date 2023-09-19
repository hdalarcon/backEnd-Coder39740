import { faker } from '@faker-js/faker';
import chai from "chai";
import supertest from "supertest";
import initServer from "./index.js";

const expect = chai.expect;

import UserMongooseRepository from "../data/repositories/userMongooseRepository.js";

describe('Testeando user mongoose repository', () =>{
    before(async function(){
        const { app, db } = await initServer();
        const application = app.callback();
        this.requester = supertest.agent(application);
        this.app = app;
        this.db = db;
        this.userRepository = new UserMongooseRepository();
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
    it('El repository debe ser una instancia de userMongooseRepository', function()
    {
        expect(this.userRepository).to.be.instanceOf(UserMongooseRepository);
    });
    it('El repository debe poder crear un usuario', function()
    {
        this.timeout(5000);
        const user = {
            firstName: `${faker.person.firstName()} name`,
            lastName: `${faker.person.lastName()} Perez`,
            email: `email${faker.internet.email()}`,
            age: 28,
            isAdmin: faker.datatype.boolean(),
            password: '654321'
        };
        return this.userRepository
        .create(user)
        .then(result =>
        {
            expect(result).to.be.an('object');
            expect(result).to.has.a.property('firstName').to.be.a('string');
            expect(result).to.has.a.property('lastName').to.be.a('string');
            expect(result).to.has.a.property('email').to.be.a('string');
            expect(result).to.has.a.property('age').to.be.a('number');
            expect(result).to.has.a.property('isAdmin').to.be.a('boolean');
            expect(result.email).to.be.equals(user.email);
        });
    });
    it('El repository debe poder devolver un solo usuario con el metodo getOne()', function()
    {
        this.timeout(5000);
        const user = {
            firstName: `${faker.person.firstName()} name`,
            lastName: `${faker.person.lastName()} Perez`,
            email: `email${faker.internet.email()}`,
            age: 28,
            isAdmin: faker.datatype.boolean(),
            password: '654321'
        };
        return this.userRepository
                .create(user)
                .then(result =>
                {
                this.userRepository
                    .getOne(result.id)
                    .then(res =>
                        {
                            expect(res).to.be.an('object');
                            expect(res.email).to.be.a('string');
                            expect(res.id.toString()).to.have.a.lengthOf(24);
                        });
                });
    });
    it('El repository debe permitir actualizar los datos del usuario', function()
    {
        this.timeout(5000);
        const user = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            age: 28,
            isAdmin: faker.datatype.boolean(),
            password: 'kgldfkhñl'
        };
        return this.userRepository
            .create(user)
            .then(result =>
            {
                const body = {
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    age: 28,
                    isAdmin: faker.datatype.boolean(),
                    password: 'kgldfkhñl'
                    };
                this.userRepository
                    .updateOne(result.id, body)
                    .then(res =>
                    {
                        expect(res).to.be.an('object');
                        expect(res).to.has.a.property('email').to.be.a('string');
                    });
            });
    });
    it('El repositorio debe devolver un arreglo', function()
    {
        this.timeout(5000);
        return this.userRepository
            .paginate({ limit: 5, page: 1 })
            .then(result =>
            {
                expect(Array.isArray(result.users)).to.be.equals(true);
                expect(result.rest.limit).to.be.equals(5);
            }
        );
    });
    it('El repository debe poder eliminar un usuario', function()
    {
        this.timeout(5000);
        const user = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            age: 28,
            isAdmin: faker.datatype.boolean(),
            password: 'kgldfkhñl'
        };
        return this.userRepository
            .create(user)
            .then(result =>
            {
                this.userRepository
                .deleteOne(result.id)
                .then(res =>
                {
                    expect(res).to.not.throw();
                    expect(res).to.be.null;
                });
            });
    });
});
