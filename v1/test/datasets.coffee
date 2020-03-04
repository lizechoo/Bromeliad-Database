chai = require 'chai'
specHelper = require './utils/specHelper'
api = specHelper.api
random = specHelper.random
expect = chai.expect
masterToken = null

masterLogin =
  username: 'master'
  password: 'bwgdb'

inserted = []

data = require './mocks/datasets/new.json'
noName = require './mocks/datasets/noName.json'
noCountry = require './mocks/datasets/noCountry.json'
noLocation = require './mocks/datasets/noLocation.json'
noYear = require './mocks/datasets/noYear.json'
yearNotNumber = require './mocks/datasets/yearNotNumber.json'
yearLessThan1900 = require './mocks/datasets/yearLessThan1900.json'
latNotNumber = require './mocks/datasets/latNotNumber.json'
lngNotNumber = require './mocks/datasets/lngNotNumber.json'
latLargerThan90 = require './mocks/datasets/latLargerThan90.json'
lngLessThanNeg180 = require './mocks/datasets/lngLessThan-180.json'

describe 'Datasets |', ->
  it 'should login master user and get token', (done) ->
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

  it 'should create 2 datasets', (done) ->
    api('datasets/new')
    .method('POST')
    .send(data)
    .auth(masterToken)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body).to.be.an 'object'
      expect(body.success).to.equal true
      expect(body.results).to.be.an 'object'
      expect(body.results.inserted).to.have.length 2
      inserted = body.results.inserted
      expect(body.results.errors).to.be.undefined
      done()

  it 'fails trying to use the same name for the datasets', (done) ->
    api('datasets/new')
    .method('POST')
    .send(data)
    .auth(masterToken)
    .expect(500)
    .end (err, body) ->
      done(err) if err
      expect(body.error['Row 0']).to.equal 'A dataset with the same \'name\' already exists'
      expect(body.error['Row 1']).to.equal 'A dataset with the same \'name\' already exists'
      done()

  it 'should delete one of the datasets', (done) ->
    api('datasets/delete')
    .method('POST')
    .send(datasets: [inserted[0]])
    .auth(masterToken)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body.success).to.equal true
      done()

  it 'should successfully add one dataset and reject another with existing name', (done) ->
    api('datasets/new')
    .method('POST')
    .send(data)
    .auth(masterToken)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body.results.inserted).to.have.length 1
      inserted[0] = body.results.inserted[0]
      expect(Object.keys(body.results.errors)).to.have.length 1
      done()

  it 'should edit existing datasets', (done) ->
    editData = datasets: {}
    editData.datasets[inserted[0]] =
      lat: 65.01
      lng: -170.28
      country: "United States"
      location: "California"
      year: 2012
    api('datasets/edit')
    .method('POST')
    .send(editData)
    .auth(masterToken)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body.success).to.equal true
      expect(body.results.updated[0]).to.equal inserted[0]
      done()

  it 'fails trying to change name to an existing dataset', (done) ->
    editData = datasets: {}
    editData.datasets[inserted[0]] =
      name: data.datasets[1].name
    api('datasets/edit')
    .method('POST')
    .send(editData)
    .auth(masterToken)
    .expect(500)
    .end (err, body) ->
      done(err) if err
      expect(body.error).to.equal "Another dataset has the same name"
      done()

  it 'should delete inserted datasets', (done) ->
    api('datasets/delete')
    .method('POST')
    .send(datasets: inserted)
    .auth(masterToken)
    .expect(200)
    .end (err, body) ->
      done(err) if err
      expect(body.success).to.equal true
      done()

  describe 'New dataset validations |', ->
    it 'fails if name field is not provided', (done) ->
      api('datasets/new')
      .method('POST')
      .send(noName)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'name' is required"
        done()

    it 'fails if country field is not provided', (done) ->
      api('datasets/new')
      .method('POST')
      .send(noCountry)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'country' is required"
        done()

    it 'fails if location field is not provided', (done) ->
      api('datasets/new')
      .method('POST')
      .send(noLocation)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'location' is required"
        done()

    it 'fails if year field is not provided', (done) ->
      api('datasets/new')
      .method('POST')
      .send(noYear)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'year' is required"
        done()

    it 'fails if year field is not a number', (done) ->
      api('datasets/new')
      .method('POST')
      .send(yearNotNumber)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'year' must be a number"
        done()

    it 'fails if year field is less than 1900', (done) ->
      api('datasets/new')
      .method('POST')
      .send(yearLessThan1900)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'year' must be between 1900 and 2100"
        done()

    it 'fails if lat field is not a number', (done) ->
      api('datasets/new')
      .method('POST')
      .send(latNotNumber)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'lat' must be a number"
        done()

    it 'fails if lng field is not a number', (done) ->
      api('datasets/new')
      .method('POST')
      .send(lngNotNumber)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'lng' must be a number"
        done()

    it 'fails if lat field is larger than 90', (done) ->
      api('datasets/new')
      .method('POST')
      .send(latLargerThan90)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'lat' must be between -90 and 90"
        done()

    it 'fails if lng field is less than -180', (done) ->
      api('datasets/new')
      .method('POST')
      .send(lngLessThanNeg180)
      .auth(masterToken)
      .expect(400)
      .end (err, body) ->
        done(err) if err
        expect(body.success).to.equal false
        expect(body.error).to.equal "Field 'lng' must be between -180 and 180"
        done()
