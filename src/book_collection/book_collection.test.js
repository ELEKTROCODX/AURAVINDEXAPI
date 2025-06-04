import request from 'supertest';
import app from '../../app.js';
import { connectToDatabase, disconnectFromDatabase } from '../config/database_connection.js';
import { app_config } from '../config/app.config.js';

let token;

beforeAll(async () => {
    await connectToDatabase();
    const res = await request(app).post('/v1/auth/login').send({
        email: app_config.app_admin_email,
        password: app_config.app_admin_password
    });
    token = res.body.token;
});

afterAll(async () => {
    // if(mongoose.connection.db){
    //     await mongoose.connection.db.dropDatabase();
    // }
    await disconnectFromDatabase();
});

describe('book_collection API', () => {
    let name_test = "OTRA_PRUEBA";
    let book_collection_id;
    describe('POST /book_collection/', () => {
        it('Should register new book collection successfully', async () => {
            const res = await request(app).post('/v1/book_collection/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: name_test
            });
            //console.log(res);
            
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Book collection registered successfully');
            
        });
        it('Should return validation errors for invalid data', async () => {
            const res = await request(app).post('/v1/book_collection/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "",
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toHaveLength(1);
        });
    });
    describe('GET /book_collection/', () => {
        it('Should return all book collections.', async () => {
            const res = await request(app).get('/v1/book_collection/');
            console.log(res.body);
            
            expect(res.statusCode).toEqual(200);
        });
    });
    
    describe('GET FILTERED /book_collection/', () => {
        it('Should return the book collection object that was created.', async () => {
            const res = await request(app).get(`/v1/book_collection/?filter_field=name&filter_value=${name_test}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(1);
            
            book_collection_id = res.body[0]._id;
            console.log(book_collection_id);
        });
    });
    
    describe('PUT /book_collection/', () => {
        it('Should update the book collection that was created.', async () => {
            const res = await request(app).put(`/v1/book_collection/${book_collection_id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "NEW_NAME",
            });
            expect(res.statusCode).toEqual(200);
        });
    });

    describe('DELETE /book_collection/', () => {
        it('Should return errors when deleting book collection for invalid ID', async () => {
            const res = await request(app).delete('/v1/book_collection/id')
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toHaveLength(1);
        });

        it('Should successfully delete', async () => {
            const res = await request(app).delete(`/v1/book_collection/${book_collection_id}`)
            .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
    });

});