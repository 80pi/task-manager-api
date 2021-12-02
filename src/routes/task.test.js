const request=require('supertest')
const {userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    resetDb,}=require('../../test/fixtures/db')
const app=require('../app')
const Task=require('../models/task')


beforeEach(resetDb)

test('should post correct call', async () => {
    await request(app)
    .post('/task')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
            desc:"fourth"
    }).expect(201)
})

test('should see particular user created tasks', async () => {
    const res=await request(app)
    .get('/task')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    expect(res.body.length).toEqual(2)
});

test('should not delete 1st task by 2nd user', async () => {
    await request(app)
    .delete('/task/${taskOne._id}')
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .expect(404)
    const task=Task.findById(taskOne._id)
    expect(task._id).not.toBeNull()
});