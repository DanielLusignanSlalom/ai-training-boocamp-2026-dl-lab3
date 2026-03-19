const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) db.close();
});

describe('Tasks API', () => {
  let taskId;

  it('should create a new task with default priority P3', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'A test task', due_date: '2025-09-30' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    expect(res.body.description).toBe('A test task');
    expect(res.body.due_date).toBe('2025-09-30');
    expect(res.body.completed).toBe(0);
    expect(res.body.priority).toBe('P3');
    taskId = res.body.id;
  });

  it('should create a task with explicit P1 priority', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Urgent Task', priority: 'P1' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P1');
  });

  it('should fall back to P3 for invalid priority values', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Bad Priority Task', priority: 'P9' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P3');
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single task by id', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('should update a task including priority', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task', description: 'Updated', due_date: '2025-10-01', priority: 'P2' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.description).toBe('Updated');
    expect(res.body.due_date).toBe('2025-10-01');
    expect(res.body.priority).toBe('P2');
  });

  it('should mark a task as completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.status).toBe(204);
  });
});
