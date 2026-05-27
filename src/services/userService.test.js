const express = require('express');
const request = require('supertest');
const userService = require('./userService');

describe('User Service', () => {
  it('should register a user', async () => {
    const res = await request(express())
      .post('/register')
      .send({ username: 'testuser', password: 'password' });
    expect(res.status).toBe(201);
  });

  it('should login a user', async () => {
    const res = await request(express())
      .post('/login')
      .send({ username: 'testuser', password: 'password' });
    expect(res.status).toBe(200);
  });
});