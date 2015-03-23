# ng-xtorage-expiration

[![Build Status](https://travis-ci.org/ericmdantas/ng-xtorage-expiration.svg?branch=master)](https://travis-ci.org/ericmdantas/ng-xtorage-expiration)
[![Coverage Status](https://coveralls.io/repos/ericmdantas/ng-xtorage-expiration/badge.svg?branch=master)](https://coveralls.io/r/ericmdantas/ng-xtorage-expiration?branch=master)

You choose who lives and dies! >:D


# installation

```

$ bower install ng-xtorage-expiration --save

```


# api

By having ```emd.ng-xtorage-expiration``` as a dependency in your AngularJS module, you'll have access to a new function inside ```$xtorage```: ```expire```.


# $xtorage.expire(key, expirationTime)

Where:

- **key** is the key of the object in the storage to be expired;
- **expirationTime** is the time it'll take for such info to be expired; 


## usage:

```js

angular
  .module('myAwesomeApp', ['emd.ng-xtorage-expiration'])
  .run(function($xtorage)
  {
      $xtorage.saveInLocalStorage('a', {info: 'to-be-saved', in: 'the storage'});
      $xtorage.saveInLocalStorage('b', {anotherInfo: 'to-be-saved', in: 'the storage'});
      
      $xtorage.expire('a', 10000); // will KILL the info inside localStorage with the key 'a'. 
                                   // It'll take 1 minute and 10 seconds, since 1 minute is for the wait
                                   
      var _fromLocalStorageA = $xtorage.getFromLocalStorage('a');
      var _fromLocalStorageB = $xtorage.getFromLocalStorage('b');
      
      console.log(_fromLocalStorageA); // {info: 'to-be-saved', in: 'the storage'}
      console.log(_fromLocalStorageB); // {anotherInfo: 'to-be-saved', in: 'the storage'}
      
      // a minute and ten seconds later...
      
      var _fromLocalStorageAInTheFuture = $xtorage.getFromLocalStorage('a');
      var _fromLocalStorageBInTheFuture = $xtorage.getFromLocalStorage('b');
      
      console.log(_fromLocalStorageAInTheFuture); // null, He's dead, Jim.
      console.log(_fromLocalStorageBInTheFuture); // {anotherInfo: 'to-be-saved', in: 'the storage'}, alive and kicking!
  })

```

#LICENSE

MIT
