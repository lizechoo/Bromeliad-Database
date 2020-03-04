chai = require 'chai'
specHelper = require './utils/specHelper'
api = specHelper.api
random = specHelper.random
expect = chai.expect
masterToken = null
userToken = null

masterLogin =
  username: 'master'
  password: 'bwgdb'
  role: 'admin'
  name: 'Master Account'
  email: 'master@zoology.ubc.ca'

user =
  username: random(10)
  password: "12345678"
  role: "user"
  name: "Test User"
  email: random(10) + "@abc.com"

describe 'Users |', ->
  it 'should login user and get token', (done) ->
    api('users/login')
    .method('POST')
    .send(masterLogin)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal true
      expect(body.results).to.be.an 'object'
      expect(body.results.token).to.be.a 'string'
      masterToken = body.results.token
      done()

  it 'should create user', (done) ->
    api('users/create')
    .method('POST')
    .send(user)
    .expect(200)
    .auth(masterToken)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal true
      expect(body.results).to.be.an 'object'
      expect(body.results.user).to.be.an 'object'
      expect(body.results.user.username).to.equal user.username
      expect(body.results.user.role).to.equal user.role
      expect(body.results.user.name).to.equal user.name
      expect(body.results.user.email).to.equal user.email
      done()

  it 'should login user and get token', (done) ->
    api('users/login')
    .method('POST')
    .send(user)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal true
      expect(body.results).to.be.an 'object'
      expect(body.results.token).to.be.a 'string'
      userToken = body.results.token
      done()

  it 'fails to login non-existing username', (done) ->
    user1 =
      username: "hihihi"
      password: "12345678"
    api('users/login')
    .method('POST')
    .send(user1)
    .expect(403)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal false
      expect(body.error).to.equal "Username and/or password does not exist"
      done()

  it 'fails to login with wrong password', (done) ->
    user1 =
      username: "master"
      password: "wrongpassword"
    api('users/login')
    .method('POST')
    .send(user1)
    .expect(403)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal false
      expect(body.error).to.equal "Username and/or password does not exist"
      done()

  it 'fails to create user without admin privileges', (done) ->
    api('users/create')
    .method('POST')
    .send(user)
    .expect(403)
    .auth(userToken)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal false
      expect(body.error).to.equal 'Access denied for your role: user'
      done()

  it 'fails to create user with already existing username', (done) ->
    api('users/create')
    .method('POST')
    .send(masterLogin)
    .expect(400)
    .auth(masterToken)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal false
      expect(body.error).to.equal 'Already exists: username'
      done()

  it 'fails to create user with already existing password', (done) ->
    dupEmail =
      username: 'dupEmail'
      password: 'bwgdb'
      role: 'admin'
      name: 'Duplicate Email'
      email: 'master@zoology.ubc.ca'
    api('users/create')
    .method('POST')
    .send(dupEmail)
    .expect(400)
    .auth(masterToken)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal false
      expect(body.error).to.equal 'Already exists: email'
      done()

  describe 'Validation tests |', ->
    describe 'Username |', ->
      it 'fails to create user when username is not a string', (done) ->
        user1 =
          username: 123
          password: "12345678"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Username must be a string'
          done()

      it 'fails to create user when username is empty', (done) ->
        user1 =
          username: " "
          password: "12345678"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Username must not be empty'
          done()

      it 'fails to create user when username is smaller than length 4', (done) ->
        user1 =
          username: "123"
          password: "12345678"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Username must have at least 4 characters'
          done()

      it 'fails to create user when username has special character', (done) ->
        user1 =
          username: "123@"
          password: "12345678"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Username must contain only alphanumeric characters or underscore'
          done()
    describe 'Password |', ->

      it 'fails to create user when password is not a string', (done) ->
        user1 =
          username: "12345"
          password: 1111
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Password must be a string'
          done()

      it 'fails to create user when password is empty', (done) ->
        user1 =
          username: "12345"
          password: ""
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Password must not be empty'
          done()

      it 'fails to create user when password is smaller than length 4', (done) ->
        user1 =
          username: "12354"
          password: "000"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Password must be between 4 and 16 characters'
          done()

      it 'fails to create user when password is larger than length 16', (done) ->
        user1 =
          username: "12354"
          password: "123456787654321999"
          role: "user"
          name: "Test User"
          email: random(10) + "@abc.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Password must be between 4 and 16 characters'
          done()
    describe 'Email |', ->
      it 'fails to create user when email is invalid', (done) ->
        user1 =
          username: "12345abcde"
          password: "1234"
          role: "user"
          name: "Test User"
          email: "12345@abcde"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Email is invalid'
          done()

    describe 'Role |', ->
      it 'fails to create user when role is invalid', (done) ->
        user1 =
          username: "12345abcde"
          password: "1234"
          role: "invalid"
          name: "Test User"
          email: "12345@abcde.com"
        api('users/create')
        .method('POST')
        .send(user1)
        .expect(400)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal false
          expect(body.error).to.equal 'Role is invalid'
          done()
  describe 'Update user |', ->
    it 'should update user password', (done) ->
      editedUser =
        username: user.username
        password: "edited"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(200)
      .auth(userToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal true
        done()

    it 'admin can edit users', (done) ->
      editedUser =
        username: user.username
        password: "edited"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(200)
      .auth(masterToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal true
        done()

    it 'fails when user tries to change its role', (done) ->
      editedUser =
        username: user.username
        role: "admin"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(403)
      .auth(userToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal false
        expect(body.error).to.equal "Role cannot be changed by non-admin"
        done()

    it 'should change user role to admin by admin', (done) ->
      editedUser =
        username: user.username
        role: "admin"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(200)
      .auth(masterToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal true
        done()

    it 'should change user role to user by admin', (done) ->
      editedUser =
        username: user.username
        role: "user"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(200)
      .auth(masterToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal true
        done()

    it 'should fail when user tries to change another user', (done) ->
      editedUser =
        username: "master"
        email: "tries@zoology.ubc.ca"
      api('users/edit')
      .method('POST')
      .send(editedUser)
      .expect(403)
      .auth(userToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal false
        expect(body.error).to.equal "Role 'admin' required to edit user"
        done()

    it 'should be able to delete a user', (done) ->
      # create user
      user1 =
        username: random(10)
        password: "12345678"
        role: "user"
        name: "Test User"
        email: random(10) + "@abc.com"
      api('users/create')
      .method('POST')
      .send(user1)
      .expect(200)
      .auth(masterToken)
      .end (err, body) ->
        done(err) if err
        # delete the users
        api('users/delete')
        .method('POST')
        .send(username: user1.username)
        .expect(200)
        .auth(masterToken)
        .end (err, body) ->
          done(err) if err
          expect(body).to.be.an 'object'
          expect(body.success).to.equal true
          done()

    it 'fails when trying to delete yourself', (done) ->
      api('users/delete')
      .method('POST')
      .send(username: "master")
      .expect(403)
      .auth(masterToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal false
        expect(body.error).to.equal "Cannot delete yourself"
        done()

    it 'fails when a user is trying to delete an admin', (done) ->
      api('users/delete')
      .method('POST')
      .send(username: "master")
      .expect(403)
      .auth(userToken)
      .end (err, body) ->
        done(err) if err
        expect(body).to.be.an 'object'
        expect(body.success).to.equal false
        expect(body.error).to.equal "Role 'admin' required to delete user"
        done()
