HijackDI
========

[![Build Status](https://drone.io/github.com/sentinaught/hijackdi/status.png)](https://drone.io/github.com/sentinaught/hijackdi/latest)

HijackDI provides a way of mocking, faking or stubbing external dependencies that are loaded via require() in nodejs.   

##Installation

The easiest way to install is through the Node Package Manager (NPM)

```shell
    npm install hijackdi
```

##Usage

If we have the following class...

MyClass.js
```javascript 
    var bob = require('bob'),
        jimmy = require('./jimmy.js');
        
    var MyClass = function(){
        this.do = function(){
            return bob() + jimmy();
        }
    };
    
    module.exports = MyClass;
```

...we could mock, stub or fake out the require(s) using HijackDI.  The test below demonstrates how this is done. 

Test.js
```javascrpt
  require('chai').should();
  var Hijackdi = require('hijackdi');
  var hijackdi = new Hijackdi('MyClass.js');
  
  test('a test', function(){
    var stubs = {
        'bob' : function(){
            return 'hello'
        },
        './jimmy.js' : function(){
            return 'world'
        }
    };
	
	hijackdi.sandbox(stubs,function(MyClass){
	    var myClass = new MyClass();
	    myClass.do().should.equal('helloworld');
	});
  });
```

The hijack object created has a sandbox method that takes an object literal containing the external dependencies that you wish to replace.  The function supplied in this method is the code executed whilst the dependencies are replaced.  After execution of this function the mocked/stubbed/faked dependencies are removed.  