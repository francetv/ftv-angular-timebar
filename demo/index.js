angular.module('demoApp', ['ftv.components.timeBar']);
angular.module('demoApp').controller('DemoController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.onCursorJumped = function(time) {
        console.log('Cursor has jumped to '+time);
        $scope.cursorPosition = time;
        $scope.$apply();
    }

    $scope.dragging = function(time) {
        console.log('Dragging to '+time);
        $scope.timeDragged = time;
        $scope.$apply();
    }

    $scope.startDragging = function() {
        console.log('Start dragging');
        $scope.isDragging = true;
        $scope.$apply();
    }

    $scope.stopDragging = function() {
        console.log('Stop dragging');
        $scope.isDragging = false;
        $scope.$apply();
    }

    $scope.getDuration = function() {
        return 60; //1 min
    }
}]);
