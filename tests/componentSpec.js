describe('FTV::Timebar::Component', function () {
    var element, $scope, directiveScope;

    beforeEach(module('ftv.components.timeBar'));

    beforeEach(inject(function ($compile, $rootScope) {
        $scope = $rootScope;

        element = $compile('<time-bar></zoom-progress-bar>')($scope);
    }));

    describe('rendering', function () {
        it('loading', function () {
            $scope.timeRatio = 50;
            $scope.$digest();

            var $element = $(element[0]);
            expect($element.find('.progressBar__bar').length).toBe(1);
            expect($element.find('.progressBar__cursor').length).toBe(1);
        });
    });

    describe('emitCursorJumper', function () {
        it('call a jumpCursor parent scope function', function(){
            var dummyTimeRatio = 10;
            var dummyTime = 33;

            $scope.$digest();

            directiveScope = element.isolateScope();
            spyOn(directiveScope, 'jumpCursor');
            spyOn(directiveScope, 'convertRatioToTime').and.returnValue(dummyTime);

            directiveScope.emitCursorJumper(dummyTimeRatio);

            expect(directiveScope.convertRatioToTime).toHaveBeenCalled();
            expect(directiveScope.jumpCursor).toHaveBeenCalledWith({time: dummyTime});
        });
    });

    describe('getTimeRatioForOffsetX', function () {
        it('call a jumpCursor parent scope function', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();
            spyOn(directiveScope, 'getProgressBarWidth').and.returnValue(60);

            expect(directiveScope.getTimeRatioForOffsetX(30)).toEqual(50);
        });
    });

    describe('convertRatioToTime', function () {
        it('convert ration to time', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();
            directiveScope.duration = 20;

            expect(directiveScope.convertRatioToTime(50)).toEqual(10);
        });
    });

    describe('convertTimeToRatio', function () {
        it('convert ration to time', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();
            directiveScope.duration = 20;

            expect(directiveScope.convertTimeToRatio(10)).toEqual(50);
        });
    });

    describe('setBarWidthWithRatio', function () {
        it('convert ration to time', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();

            directiveScope.setBarWidthWithRatio(50);

            var $element = $(element[0]);
            expect($element.find('.progressBar__bar').css('width')).toEqual('50%');
        });
    });

    describe('setBarWidthWithTime', function () {
        it('convert ration to time', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();
            directiveScope.duration = 20;

            directiveScope.setBarWidthWithTime(10);

            var $element = $(element[0]);
            expect($element.find('.progressBar__bar').css('width')).toEqual('50%');
        });
    });

    describe('$on("zoomProgressTimeChange")', function () {
        it('convert ration to time', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();
            spyOn(directiveScope, 'setBarWidthWithTime');

            directiveScope.$emit('zoomProgressTimeChange', 10);

            expect(directiveScope.setBarWidthWithTime).toHaveBeenCalledWith(10);
        });
    });

    describe('moveTo', function () {
        it('do nothing if element is the cursor', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();

            spyOn(directiveScope, 'getProgressBarWidth').and.returnValue(60);
            spyOn(directiveScope, 'emitCursorJumper');

            directiveScope.timeRatio = 10;
            var $dummyEvent = {target: {className: 'progressBar__cursor'}};
            directiveScope.moveTo($dummyEvent);

            expect(directiveScope.timeRatio).toEqual(10);
        });

        it('do nothing if element is the cursor', function(){
            $scope.$digest();
            directiveScope = element.isolateScope();

            spyOn(directiveScope, 'getProgressBarWidth').and.returnValue(60);
            spyOn(directiveScope, 'emitCursorJumper');
            spyOn(directiveScope, 'setBarWidthWithRatio');

            var $dummyEvent = {offsetX: 30, target: {className: 'not__cursor'}};
            directiveScope.moveTo($dummyEvent);

            expect(directiveScope.emitCursorJumper).toHaveBeenCalledWith(50);
            expect(directiveScope.setBarWidthWithRatio).toHaveBeenCalledWith(50);
        });
    });
});
