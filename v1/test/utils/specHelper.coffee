request = require 'request'
BASE_URL = 'http://localhost:8888/v1/api/'
token = null
specHelper = null

class SpecHelper
  constructor: ->
    @request = params: {}
  route: (route) ->
    parts = route.split("/")
    @request.params.route = parts[0]
    @request.params.action = parts[1]
    return this
  send: (send) ->
    @request.send = send
    return this
  method: (method) ->
    @request.method = method
    return this
  expect: (expect) ->
    @request.expect = expect
    return this
  params: (params) ->
    for param, value of params
      @request.params[param] = value
    return this
  auth: (auth) ->
    @request.auth = auth
    return this
  end: (callback) ->
    options =
      method: @request.method
      uri: BASE_URL
      headers: {}
    options.qs = @request.params if @request.params
    options.headers['Authorization'] = "bearer " + @request.auth if @request.auth
    options.headers["Content-Type"] = "application/json"
    options.body = JSON.stringify(@request.send) if @request.send
    request options, (error, response, body) =>
      if (response.statusCode != @request.expect)
        console.log body
        throw new Error("Response code expected: #{@request.expect}, actual: #{response.statusCode}")
      try
        parsed = JSON.parse body
      catch e
        console.error (body)
      callback error, parsed

module.exports =
  api: (route) ->
    specHelper = new SpecHelper()
    specHelper.route(route)
    return specHelper
  random: (num) ->
    char = "AzByC0xDwEv9FuGt8HsIrJ7qKpLo6MnNmO5lPkQj4RiShT3gUfVe2WdXcY1bZa"
    string = ""
    for i in [0..num]
      rand = Math.floor(Math.random() * char.length)
      string += char[rand]
    return string
