/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 France Télévisions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

angular.module('ftv.components.timeBar', [
        'ftv.components.timeBar.templates'
    ])
    .directive('timeBar', ['$timeout', '$document', '$window', function ($timeout, $document, $window) {
        return {
            restrict: 'E',
            scope: {
                duration: '=',
                startDragging: '&onCursorStartDragging',
                stopDragging: '&onCursorStopDragging',
                dragging: '&onCursorDragging',
                jumpCursor: '&onCursorJumped'
            },
            templateUrl: '/timeBar/index.html',
            link: function($scope, element) {
                var $bar = element.find('.progressBar__bar');

                $scope.getProgressBarWidth = function(){
                    return element.find('.progressBar').width();
                };

                $scope.getTimeRatioForOffsetX = function(offsetX){
                    var progressBarWidth = $scope.getProgressBarWidth();
                    return offsetX / progressBarWidth * 100;
                };

                element.bind('click', function($event){
                    $scope.moveTo($event);
                });

                $scope.moveTo = function($event) {
                    if ($event.target.className === 'progressBar__cursor') {
                        return;
                    }
                    var timeRatio = $scope.getTimeRatioForOffsetX($event.offsetX);
                    $scope.setBarWidthWithRatio(timeRatio);
                    $scope.emitCursorJumper(timeRatio);
                };

                $scope.emitCursorJumper = function(timeRatio) {
                    var time = $scope.convertRatioToTime(timeRatio);
                    $scope.jumpCursor({time: time});
                };

                var isDragging = false;

                $scope.moveCursor = function($event){
                    if (isDragging) {
                        return;
                    }
                    if ($event.target.className === 'progressBar__cursor') {
                        return;
                    }

                    var timeRatio = $scope.getTimeRatioForOffsetX($event.offsetX);
                    $scope.setBarWidthWithRatio(timeRatio);
                };

                $scope.setBarWidthWithTime = function (time) {
                    $scope.setBarWidthWithRatio($scope.convertTimeToRatio(time));
                };

                $scope.setBarWidthWithRatio = function (ratio) {
                    $bar.css('width', ratio + '%');
                };

                $scope.convertTimeToRatio = function (time) {
                    return time / $scope.duration * 100;
                };

                $scope.convertRatioToTime = function (ratio) {
                    return ratio * $scope.duration / 100;
                };

                $scope.$watch('duration', function(){
                    $scope.setBarWidthWithTime(0);
                });

                $scope.$on('zoomProgressTimeChange', function(event, time){
                    $scope.setBarWidthWithTime(time);
                });

                $scope.setBarWidthWithTime(0);

                element.find(".progressBar__cursor").on('mousedown', startDrag);
                element.find(".progressBar__cursor").on('touchstart', startDrag);

                function startDrag(event){
                    isDragging = true;
                    event.preventDefault();
                    $scope.startDragging();
                    setTimeRatioForEvent(event);
                    $document.on('touchmove', dragging);
                    $document.on('touchend', stopDrag);
                    $document.on('mousemove', dragging);
                    $document.on('mouseup', stopDrag);
                }

                function getProgressBarProperty() {
                    var $progressBar = element.find('.progressBar');
                    var refXLeft = $progressBar.offset().left;
                    var progressBarWidth = $progressBar.width();

                    return {
                        $progressBar: $progressBar,
                        refXLeft: refXLeft,
                        progressBarWidth: progressBarWidth
                    };
                }

                var draggingRatio = 0;
                function setTimeRatioForEvent(event) {
                    var progressBarProperty = getProgressBarProperty();
                    var refXLeft = progressBarProperty.refXLeft;
                    var progressBarWidth = progressBarProperty.progressBarWidth;

                    var xPos = event.pageX;
                    if (!xPos) {
                        xPos = event.originalEvent.touches[0].pageX;
                    }
                    var offsetX = xPos - refXLeft;
                    if (offsetX < 0) {
                        offsetX = 0;
                    }
                    if (offsetX > progressBarWidth) {
                        offsetX = progressBarWidth;
                    }

                    draggingRatio = $scope.getTimeRatioForOffsetX(offsetX);
                    $scope.dragging({time: $scope.convertRatioToTime(draggingRatio)});
                    $scope.setBarWidthWithRatio(draggingRatio);
                }

                function dragging(event) {
                    setTimeRatioForEvent(event);
                }

                function stopDrag() {
                    isDragging = false;
                    $scope.emitCursorJumper(draggingRatio);
                    $scope.stopDragging();
                    $document.off('touchmove', dragging);
                    $document.off('touchend', stopDrag);
                    $document.off('mousemove', dragging);
                    $document.off('mouseup', stopDrag);
                }

                var timeoutResize;
                function onResize() {
                    var progressBarProperty = getProgressBarProperty();
                    var $progressBar = progressBarProperty.$progressBar;
                    var refXLeft = progressBarProperty.refXLeft;
                    var progressBarWidth = progressBarProperty.progressBarWidth;

                    $timeout.cancel(timeoutResize);
                    timeoutResize = $timeout(function(){
                        if ($progressBar.offset().left === refXLeft) {
                            return;
                        }

                        refXLeft = $progressBar.offset().left;
                        progressBarWidth = $progressBar.width();
                    }, 500);
                }

                angular.element($window).unbind('resize', onResize);
                angular.element($window).bind('resize', onResize);
            }
        };
    }]);
