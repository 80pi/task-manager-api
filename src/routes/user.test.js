const request=require('supertest')
const {userOneId,
    userOne,
    resetDb,}=require('../../test/fixtures/db')
const app=require('../app')
const User=require('../models/user')




beforeEach(resetDb)

test('should post correct call', async () => {
    await request(app)
    .post('/user').send({
        name:"gopi",
        email:"gopi@gmail.com",
        password:"gopiajay"
    }).expect(201)
})


test('should login', async () => {
    const response= await request(app).post('/user/login').send({
        email:userOne.email,
        password:userOne.password,
    }).expect(200)
    const user=await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
});


test('should not login', async () => {
    await request(app).post('/user/login').send({
        email:userOne.email,
        password:'123456789'
    }).expect(400)
});

test('should login on auth', async () => {
    await request(app)
    .get('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
});

test('should not login on auth', async () => {
    await request(app)
    .get('/user/me')
    .send()
    .expect(404)
});

test('should login on auth user need to delete', async () => {
    await request(app)
    .delete('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user=await User.findById(userOneId)
    expect(user).toBeNull()
});

test('should no other login on auth user need to delete', async () => {
    await request(app)
    .delete('/user/me')
    .send()
    .expect(404)
});

test('avater need to upload', async () => {
    await request(app)
    .post('/user/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('upload','test/fixtures/philly.jpg')
    .expect(200)
});

test('should update the value', async () => {
    const response=await request(app)
    .patch('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'qwse',
    })
    .expect(200)
    const user=await User.findById(userOneId)
    expect(response.body.name).toEqual(user.name)
});

test('should for undefined feild name', async() => {
    await request(app)
    .patch('/user/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        passpo:'qwse',
    })
    .expect(404)
})
