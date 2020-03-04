app.factory 'ApiF', (UserF, ConstantsF, $http, $q, DialogF) ->
  ApiF = {}

  ApiF.setOptionsHeader = (options) ->
    auth_header = "bearer #{UserF.token}"
    if options
      if options.headers
        options.headers['Authorization'] = auth_header
      else
        options.headers =
          'Authorization': auth_header
    else
      options =
        headers:
          'Authorization': auth_header

  ApiF.failCallback = (res, unmap = null) ->
    data = res.data

    if typeof data is 'string'
      console.error data
      throw new Error "Got a non-JSON response, check console logs."
    else
      if res.status is 403
        return throw new Error data.error
      else if res.status is 412
        # precondition failed, special treatment downstream
        return $q.reject(data.error)
      else
        if unmap?
          return throw new Error unmap(data.error)
        else
          return throw new Error data.error

  ApiF.successCallback = (res) ->
    data = res.data
    if typeof data is 'string'
      console.error data
      return throw new Error "Got a non-JSON response, check console logs."
    else
      # data is JSON
      unless data.success is true
        console.error data
        throw new Error "Sanity check failed. Success field is false"
      # pass the results downstream
      return data.results

  ApiF.get = (route, action, options) ->
    return $q.reject() unless UserF.token
    path = ConstantsF.getPath route, action
    options ||= {}
    ApiF.setOptionsHeader options

    return $http.get(path, options)
      .then ApiF.successCallback, ApiF.failCallback

  ApiF.post = (route, action, options, data, unmap) ->
    return $q.reject() unless UserF.token
    path = ConstantsF.getPath route, action
    options ||= {}
    ApiF.setOptionsHeader options

    return $http.post(path, data, options)
      .then ApiF.successCallback,
      (res) => ApiF.failCallback res, unmap

  ApiF.postWithLoading = (route, action, options, data, unmap) ->
    DialogF.loadingDialog ApiF.post route, action, options, data, unmap

  return ApiF
