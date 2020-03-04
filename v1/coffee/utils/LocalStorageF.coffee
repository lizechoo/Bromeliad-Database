class LocalStorage
  set: (value) ->
    if @localStorageService.set @key, value
      @storages[@key] = value
    else
      throw new Error 'Error writing to LocalStorage'

  unset: ->
    delete @storages[@key]
    @localStorageService.remove @key

  get: ->
    @storages[@key] || @localStorageService.get @key

  constructor: (@storages, @localStorageService, @key) ->

app.factory 'LocalStorageF', (localStorageService) ->
  LocalStorageF = {}
  LocalStorageF.storages = {}

  LocalStorageF.token = new LocalStorage LocalStorageF.storages, localStorageService, 'token'
  LocalStorageF.speciesState = new LocalStorage LocalStorageF.storages, localStorageService, 'speciesState'

  return LocalStorageF
