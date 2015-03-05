;(function(ng)
{
    "use strict";

    ng
        .module('emd.ng-xtorage-expiration', ['emd.ng-xtorage'])
        .provider('$xtorageExpiration', function()
        {
            var self = this;

            var EXPIRATION_KEY = '$xpiration';
            var CHECK_EXPIRATION = 1000 * 60; // 1 minute

            self.storageExpiration = 1000 * 60 * 60 * 24; // 1 day

            this.$get = ['$window', '$xtorage', '$xpirationChecker', '$interval', function($window, $xtorage, $xpirationChecker, $interval)
            {
                var DEFAULT_EXPIRATION = self.storageExpiration;

                var _initInterval = function()
                {
                    var _intervalId = $interval(function()
                    {
                        $xtorage
                            .getFromLocalStorage(EXPIRATION_KEY)
                            .filter(function(toExpire)
                            {
                                return $xpirationChecker.timeToExpire(toExpire);
                            })
                            .forEach(function(toExpire)
                            {
                                $xtorage.removeFromLocalStorage(toExpire.key);
                                $xtorage.removeFromSessionStorage(toExpire.key);

                                $interval.cancel(_intervalId);
                            })

                    }, CHECK_EXPIRATION);
                };

                var _registerExpiration = function(key, expiration)
                {
                    var _expiration = expiration || DEFAULT_EXPIRATION;

                    var _expirationObject = {};

                    _expirationObject.key = key;
                    _expirationObject.expire = $window.Date.now() + _expiration;

                    $xtorage.pushIntoLocalStorage(EXPIRATION_KEY, _expirationObject);

                    _initInterval();
                }

                return {
                            registerExpiration: _registerExpiration
                       }
            }];
        })
        .service('$xpirationChecker', ['$window', function($window)
        {
            var _timeToExpire = function(toExpire)
            {
                return $window.Date.now() >= toExpire.expire;
            }

            this.timeToExpire = _timeToExpire;
        }]);
}(angular))