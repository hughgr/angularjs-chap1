/* jshint globalstrict: true */
/* global Scope: false */
'use strict';
describe('Scope', function () {
    it('构造一个scope对象', function () {
        var scope = new Scope();
        scope.aProp = 1;

        expect(scope.aProp).toBe(1);
    });
    describe('digest', function () {
        var scope;

        beforeEach(function () {
            scope = new Scope();
        });

        it('只有在监控的值发生改变之后，$digest才执行', function () {
            var counter = 0;
            scope.name = 'wat';
            var watchFn = function (scope) {return scope.name;};
            var listenFn = function () {
                console.log('execute');
                counter++;
            };
            scope.$watch(watchFn, listenFn);
            scope.$digest();
            expect(counter).toBe(1);
            scope.$digest();
            expect(counter).toBe(1);
            scope.name = 'cc';
            scope.$digest();
            expect(counter).toBe(2);
        });
    
        it('一趟$digest之后，如果结果为脏，就再进行下一趟$digest', function () {
            var counter = 0;
            scope.a = 1;
            scope.b = 1;
            scope.$watch(
                function (scope) {return scope.a;},
                function (newValue, oldValue, scope) {
                    counter++;
                } 
            );
            scope.$watch(
                function (scope) {return scope.b;},
                function (newValue, oldValue, scope) {
                    scope.a = 2;
                }
            );
            expect(counter).toBe(0);
            scope.$digest();
            expect(counter).toBe(2);
        });

        it('震荡次数超过10次之后，应该抛出异常', function () {
            scope.a = 1;
            scope.b = 1;
            scope.$watch(
                function (scope) {return scope.a;},
                function (newValue, oldValue, scope) {
                    scope.b++;
                } 
            );
            scope.$watch(
                function (scope) {return scope.b;},
                function (newValue, oldValue, scope) {
                    scope.a++;
                }
            );
            expect(function () {
                scope.$digest();     
            }).toThrow();
            
        });

        it('开启deepwatch', function () {
            scope.a = {
                name: 'cc',
                age: 18
            };
            var counter = 0;
            scope.$watch(
                function (scope) { return scope.a;},
                function (newValue, oldValue, scope) {
                    counter++; 
                },
                true
            );
            expect(counter).toBe(0);
            scope.$digest();
            expect(counter).toBe(1);
            scope.a.name = 'bb';
            scope.$digest();
            expect(counter).toBe(2);
        });
    });
});

