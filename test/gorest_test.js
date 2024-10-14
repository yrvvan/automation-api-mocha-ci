const fs = require('fs');
require('dotenv').config();
const chai = require('chai');
const authToken = process.env.API_KEY
const assert = require('chai').expect;
chai.use(require('chai-json-schema'));

const { faker } = require('@faker-js/faker');
const page = require('../page/gorest_page.js');
const errorMessage = require("../data/error_message.json");
const testCase = require('../data/fixtures/test_case_data.json');
const data = require('../data/fixtures/gorest_data.json');
const createUserSchema = require('../data/schema/post_user_schema.json');
const createUserPostSchema = require('../data/schema/post_post_schema.json');
const createPostCommentSchema = require('../data/schema/post_comment_schema.json');
const createUserTodoSchema = require('../data/schema/post_todo_schema.json');
const getUserPostSchema = require('../data/schema/get_post_schema.json');
const getPostCommentSchema = require('../data/schema/get_comment_schema.json');
const getUserTodoSchema = require('../data/schema/get_todo_schema.json');

// Variables to store created User ID and Post ID
let userId, postId;

function writeArtifacts(data) {
  try {
    const filePath = './artifacts.json';
    
    // Step 1: If file exist, read it
    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      if (fileContent) {
        existingData = JSON.parse(fileContent);
      }
    }

    // Step 2: Combine the existing data with the new one
    if (Array.isArray(existingData)) {
      existingData.push(data);
    } else {
      existingData = [existingData, data];
    }

    // Step 3: Write the updated data back to the file
    const jsonString = JSON.stringify(existingData, null, 4);
    fs.writeFileSync(filePath, jsonString);

    console.log('JSON data appended to file:', filePath);
  } catch (error) {
    console.error('Error:', error);
  }
}


function deepCopy(object) {
    return JSON.parse(JSON.stringify(object));
}

describe(testCase.postCreateUser.description, () => {
    it(`@post ${testCase.postCreateUser.positive.validData}`, async () => {
        let modifiedData = deepCopy(data.createUser);
        modifiedData.name = faker.person.fullName();
        modifiedData.email = faker.internet.email();
        const response = await page.postCreateUser(modifiedData, authToken);
        assert(response.status).to.equal(201);
        userId = response.body.data.id;
        const createdUser = response.body;
        writeArtifacts({createdUser});
        assert(response.body.data.name).to.equal(modifiedData.name);
        assert(response.body.data.email).to.equal(modifiedData.email);
        assert(response.body).to.be.jsonSchema(createUserSchema);
    });
    it(`@post ${testCase.postCreateUser.negative.invalidData}`, async () => {
        const response = await page.postCreateUser(data.createUser, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal('email');
        assert(response.body.data[1].field).to.equal('name');
        assert(response.body.data[0].message).to.equal(errorMessage.email.message[0]);
        assert(response.body.data[1].message).to.equal(errorMessage.name.message[0]);
    });
    it(`@post ${testCase.postCreateUser.negative.invalidToken}`, async () => {
        const response = await page.postCreateUser(data.createUser, `${authToken}salt`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@post ${testCase.postCreateUser.negative.emptyToken}`, async () => {
        const response = await page.postCreateUser(data.createUser, '');
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.emptyToken);
    });
});

describe(testCase.patchUpdateUser.description, () => {
    it(`@patch ${testCase.patchUpdateUser.positive.validData}`, async () => {
        let modifiedData = deepCopy(data.updateUser);
        modifiedData.name = faker.person.fullName();
        modifiedData.email = faker.internet.email();
        const response = await page.patchUpdateUser(modifiedData, userId, authToken);
        assert(response.status).to.equal(200, response.body.data);
        const updatedUser = response.body;
        writeArtifacts({updatedUser});
        assert(response.body.data.name).to.equal(modifiedData.name);
        assert(response.body.data.email).to.equal(modifiedData.email);
        assert(response.body).to.be.jsonSchema(createUserSchema);
    });
    it(`@patch ${testCase.patchUpdateUser.negative.invalidData}`, async () => {
        const response = await page.patchUpdateUser(data.updateUser, userId, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal('email');
        assert(response.body.data[1].field).to.equal('name');
        assert(response.body.data[0].message).to.equal(errorMessage.requiredParam);
        assert(response.body.data[1].message).to.equal(errorMessage.requiredParam);
    });
    it(`@patch ${testCase.patchUpdateUser.negative.invalidToken}`, async () => {
        const response = await page.patchUpdateUser(data.updateUser, userId, `${authToken}salt`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@patch ${testCase.patchUpdateUser.negative.emptyToken}`, async () => {
        const response = await page.patchUpdateUser(data.updateUser, userId, '');
        assert(response.status).to.equal(404);
        assert(response.body.data.message).to.equal(errorMessage.resourceNotFound);
    });
});

describe(testCase.postCreateUserPost.description, () => {
    it(`@post ${testCase.postCreateUserPost.positive.validData}`, async () => {
        const response = await page.postCreateUserPost(data.createPost, userId, authToken);
        assert(response.status).to.equal(201, response.body.data);
        postId = response.body.data.id;
        const createdPost = response.body;
        writeArtifacts({createdPost});
        assert(response.body.data.title).to.equal(data.createPost.title, response.body.data);
        assert(response.body.data.body).to.equal(data.createPost.body, response.body.data);
        assert(response.body).to.be.jsonSchema(createUserPostSchema);
    });
    it(`@post ${testCase.postCreateUserPost.negative.invalidData}`, async () => {
        let modifiedData = deepCopy(data.createPost);
        modifiedData.title = '';
        modifiedData.body = '';
        const response = await page.postCreateUserPost(modifiedData, userId, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal('title');
        assert(response.body.data[1].field).to.equal('body');
        assert(response.body.data[0].message).to.equal(errorMessage.requiredParam);
        assert(response.body.data[1].message).to.equal(errorMessage.requiredParam);
    });
    it(`@post ${testCase.postCreateUserPost.negative.invalidToken}`, async () => {
        const response = await page.postCreateUserPost(data.createPost, userId, `${authToken}salt`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@post ${testCase.postCreateUserPost.negative.emptyToken}`, async () => {
        const response = await page.postCreateUserPost(data.createPost, userId, '');
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.emptyToken);
    });
});

describe(testCase.postCreatePostComment.description, () => {
    it(`@post ${testCase.postCreatePostComment.positive.validData}`, async () => {
        let modifiedData = deepCopy(data.createComment);
        modifiedData.name = faker.person.fullName();
        modifiedData.email = faker.internet.email();
        modifiedData.body = 'Comment';
        const response = await page.postCreatePostComment(modifiedData, postId, authToken);
        assert(response.status).to.equal(201, response.body.data);
        const createdComment = response.body;
        writeArtifacts({createdComment});
        assert(response.body).to.be.jsonSchema(createPostCommentSchema);
    });
    it(`@post ${testCase.postCreatePostComment.negative.invalidData}`, async () => {
        const response = await page.postCreatePostComment(data.createComment, postId, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal('name');
        assert(response.body.data[1].field).to.equal('email');
        assert(response.body.data[2].field).to.equal('body');
        assert(response.body.data[0].message).to.equal(errorMessage.requiredParam);
        assert(response.body.data[1].message).to.equal(`${errorMessage.email.message[0]}, ${errorMessage.email.message[1]}`);
        assert(response.body.data[2].message).to.equal(errorMessage.requiredParam);
    });
    it(`@post ${testCase.postCreatePostComment.negative.invalidToken}`, async () => {
        const response = await page.postCreatePostComment(data.createComment, postId, `${authToken}salt`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@post ${testCase.postCreatePostComment.negative.emptyToken}`, async () => {
        const response = await page.postCreatePostComment(data.createComment, postId, '');
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.emptyToken);
    });
});

describe(testCase.postCreateUserTodo.description, () => {
    it(`@post ${testCase.postCreateUserTodo.positive.validData}`, async () => {
        const response = await page.postCreateUserTodo(data.createTodo, userId, authToken);
        assert(response.status).to.equal(201, response.body.data);
        const createdTodo = response.body;
        writeArtifacts({createdTodo});
        assert(response.body).to.be.jsonSchema(createUserTodoSchema);
    });
    it(`@post ${testCase.postCreateUserTodo.negative.invalidData}`, async () => {
        let modifiedData = deepCopy(data.createTodo);
        modifiedData.title = '';
        modifiedData.status = '';
        const response = await page.postCreateUserTodo(modifiedData, userId, authToken);
        assert(response.status).to.equal(422);
        assert(response.body.data[0].field).to.equal('title');
        assert(response.body.data[1].field).to.equal('status');
        assert(response.body.data[0].message).to.equal(errorMessage.requiredParam);
        assert(response.body.data[1].message).to.equal(errorMessage.status.message);
    });
    it(`@post ${testCase.postCreateUserTodo.negative.invalidToken}`, async () => {
        const response = await page.postCreateUserTodo(data.createTodo, userId, `${authToken}salt`);
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.invalidToken);
    });
    it(`@post ${testCase.postCreateUserTodo.negative.emptyToken}`, async () => {
        const response = await page.postCreateUserTodo(data.createTodo, userId, '');
        assert(response.status).to.equal(401);
        assert(response.body.data.message).to.equal(errorMessage.auth.emptyToken);
    });
});

describe(testCase.getUserPost.description, () => {
    it(`@post ${testCase.getUserPost.positive.validData}`, async () => {
        const response = await page.getUserPost(userId, authToken);
        assert(response.status).to.equal(200, response.body.data);
        assert(response.body).to.be.jsonSchema(getUserPostSchema);
    });
});

describe(testCase.getPostComment.description, () => {
    it(`@post ${testCase.getPostComment.positive.validData}`, async () => {
        const response = await page.getPostComment(postId, authToken);
        assert(response.status).to.equal(200, response.body.data);
        assert(response.body).to.be.jsonSchema(getPostCommentSchema);
    });
});

describe(testCase.getUserTodo.description, () => {
    it(`@post ${testCase.getUserTodo.positive.validData}`, async () => {
        const response = await page.getUserTodo(userId, authToken);
        assert(response.status).to.equal(200, response.body.data);
        assert(response.body).to.be.jsonSchema(getUserTodoSchema);
    });
});