app.directive 'resize', ($window) ->
  return (scope, element, attr) ->
    w = angular.element $window
    scope.$watch ->
      h: w.height()
      w: w.width()
    , (newValue, oldValue) ->
      scope.windowHeight = newValue.h
      scope.windowWidth = newValue.w

      scope.resizeWithOffset = (offsetH) ->
        height: newValue.h - 138 + 'px'
    , true

    w.bind 'resize', ->
      scope.$apply()
