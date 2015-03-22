;(function(ng)
{
    "use strict";

    ng
        .module('emd.ng-xtorage-expiration', ['emd.ng-xtorage'])
        .config(['$xtorageProvider', function($xtorageProvier)
        {
            $xtorageProvier.unique = true;
        }])
        .config(['$provide', function($provide)
        {
            $provide.decorator('$xtorage', ['$delegate', '$window', '$interval', '$xpirationChecker', function($delegate, $window, $interval, $xpirationChecker)
            {
                var EXPIRATION_KEY = '$xpiration';
                var CHECK_EXPIRATION = 1000 * 60; // 1 minute
                var STORAGE_EXPIRATION = 1000 * 60 * 60 * 24; // 1 day;

                var _initInterval = function()
                {
                    $interval(function()
                    {
                        $delegate
                            .getFromLocalStorage(EXPIRATION_KEY)
                            .filter(function(toExpire)
                            {
                                return $xpirationChecker.timeToExpire(toExpire);
                            })
                            .forEach(function(toExpire)
                            {
                                $delegate.removeFromLocalStorage(toExpire.key);
                                $delegate.removeFromSessionStorage(toExpire.key);
                            });

                    }, CHECK_EXPIRATION);
                };

                var _expire = function(key, expiration)
                {
                    var _expiration = expiration || STORAGE_EXPIRATION;

                    var _expirationObject = {};

                    _expirationObject.key = key;
                    _expirationObject.expire = $window.Date.now() + _expiration;

                    $delegate.pushIntoLocalStorage(EXPIRATION_KEY, _expirationObject);

                    _initInterval();
                };

                $delegate.expire = _expire;

                return $delegate;
            }]);
        }])
        .provider('$xpirationChecker', function()
        {
            this.storageExpiration = 1000 * 60 * 60 * 24; // 1 day

            this.$get = ['$window', function($window)
            {
                var _timeToExpire = function(toExpire)
                {
                    return $window.Date.now() >= toExpire.expire;
                }

                return {timeToExpire: _timeToExpire};
            }];
        });
}(angular))