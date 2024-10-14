require('dotenv').config();
const supertest = require('supertest');

const api = supertest(process.env.BASE_URL);

const postCreateUser = (payload, token) => api.post('/users')
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

const patchUpdateUser = (payload, userId, token) => api.patch(`/users/${userId}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

const postCreateUserPost = (payload, userId, token) => api.post(`/users/${userId}/posts`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

const postCreatePostComment = (payload, postId, token) => api.post(`/posts/${postId}/comments`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

const postCreateUserTodo = (payload, userId, token) => api.post(`/users/${userId}/todos`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

const getUserPost = (userId, token) => api.get(`/users/${userId}/posts`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`);

const getPostComment = (postId, token) => api.get(`/posts/${postId}/comments`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`);

const getUserTodo = (userId, token) => api.get(`/users/${userId}/todos`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`);

module.exports = {
    postCreateUser,
    patchUpdateUser,
    postCreateUserPost,
    postCreatePostComment,
    postCreateUserTodo,
    getUserPost,
    getPostComment,
    getUserTodo
}