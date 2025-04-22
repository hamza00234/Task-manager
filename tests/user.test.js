const request= require('supertest')
const app = require('../src/app')
const User= require('../src/models/user')
const mongoose= require('mongoose')
const jwt= require('jsonwebtoken')

const id= new mongoose.Types.ObjectId()
const userone={
    _id: id,
    name:'ahmed',
    email:'ahmed@gmail.com',
    password:'ahmed12.',
    tokens:[{
        token: jwt.sign({_id:id}, process.env.JWT_SECRET)
    }]
}


beforeEach(async ()=>{
await User.deleteMany()
await new User(userone).save()
})


test('sign up', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'hamza',
            email: 'hamzaaa@gmail.com',
            password: 'hamza12!',
        });
    console.log(response.body);
    expect(response.status).toBe(201);
});

test('login', async()=>{
    await request(app).post('/users/login').send({
        email: userone.email,
        password:userone.password
    }).expect(200)
})

test('get profile', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userone.tokens[0].token}`) // Ensure 'tokens' matches your schema
        .send();
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe(userone.email);
});

test('should not get profile', async () => {
    const response = await request(app)
        .get('/users/me')
        .send();
    expect(response.status).toBe(401);
});

test('delete account', async()=>{
    await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${userone.tokens[0].token}`) // Ensure 'tokens' matches your schema
            .send()
            .expect(200)
        })


        test('should notdelete account', async()=>{
            await request(app)
                    .delete('/users/me')
                    .send()
                    .expect(401)
                })
        
        


