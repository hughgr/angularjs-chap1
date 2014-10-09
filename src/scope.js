function Scope () {
    this.$$watchers = []; 
}

function initWatchVal() {}

Scope.prototype.$watch = function (watchFn, listenFn, valueEq) {
    var watcher = {
        watchFn: watchFn,
        listenFn: listenFn || function () {},
        valueEq: !!valueEq,
        last: initWatchVal
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function () {
    var dirty;
    var ttl = 10;
    do {
        dirty = this.$$digestOnce();
        if (dirty && !(ttl--)) {
            throw '震荡次数已经达到了10次！'; 
        }
    } while (dirty);
};

Scope.prototype.$$areEqual = function (newValue, oldValue, valueEq) {
    if (valueEq) {
        return _.isEqual(newValue, oldValue);
    } else {
        return newValue === oldValue;
    }
};

Scope.prototype.$$digestOnce = function () {
    var self = this;
    var newValue, oldValue, dirty;
    _.forEach(self.$$watchers, function (watcher) {
        newValue = watcher.watchFn(self);
        oldValue = watcher.last;
        if (!self.$$areEqual(newValue, oldValue, watcher.valueEq)) {
            watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
            watcher.listenFn(newValue, oldValue === initWatchVal ? newValue : oldValue, self);
            dirty = true;
        }
    });
    return dirty;    
};
