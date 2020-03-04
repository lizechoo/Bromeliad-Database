app.factory 'FileParserF', ($q) ->
  FileParserF = {}

  FileParserF.parse = (file, options) ->
    deferred = $q.defer()
    options ||= {}
    options.complete = (results) ->
      deferred.resolve results.data
    options.error = (err) ->
      deferred.reject err

    Papa.parse file, options
    return deferred.promise

  return FileParserF
