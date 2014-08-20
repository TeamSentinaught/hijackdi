HijackDI
========

[![Build Status](https://drone.io/github.com/sentinaught/hijackdi/status.png)](https://drone.io/github.com/sentinaught/hijackdi/latest)

HijackDI provides a way of mocking, faking or stubbing external dependencies that are loaded via require() in nodejs. 

HijackDi provides a sandbox environment for you to run your tests within. In this envronment node modules or classes which are required are swiched with your fakes or mocks. This works at any level, not just at the subject meaning HikackDi is perfect for integration or unit testing.

See the examples folder for more.



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
            return bob() + ' ' +jimmy();
        }
    };
    
    module.exports = MyClass;
```

...we could mock, stub or fake out the require(s) using HijackDI.  The test below demonstrates how this is done. 

Test.js
```javascrpt
    require('chai').should();
    var Hijackdi = require('hijackdi');
    
    var hijackdi = new Hijackdi('MyClass.js'),
    stubs = {
        'bob' : function(){ return 'hello'; },
        './jimmy.js' : function(){ return 'world'; }
    };
            
    test('a test', function(){
    
    	hijackdi.sandbox(stubs,function(MyClass){
    	    var myClass = new MyClass();
    	    myClass.do().should.equal('hello world');
    	});
    	
    });
```

The hijack object created has a sandbox method that takes an object literal containing the external dependencies that you wish to replace.  The function supplied in this method is the code executed whilst the dependencies are replaced.  After execution of this function the mocked/stubbed/faked dependencies are removed.  


##API
```javascrpt
    var HijackDi = require('hijackdi');
    
    /*
        This constructs a hijackdi object with a subject. The subject will have
        the dependencies you specify switched for your mocks. Any other                 dependencies will remain intact. 
    */
    var hijackdi = new HijackDi('../lib/MySubjectClass.js');
    
    /*
        definition of the fake dependencies. These will replace the real object          in the sanbox environment. 
        
        To fake out your own objects the key should be the relative path from           the test file. For a node_module just use the module name.
    */
    
    fakes = {
        '../lib/someDependency.js': function(){ return 'hello';},
        'redis' : { createClient: function(){ return fakeRedisClient; }}
    };
    
    /*
        Within the sanbox mode redis and ../lib/someDependency.js are switched          out. Any other subdependency will be intact. If another subdependency           ALSO required redis. It will get our fake too.
    */
    
    hijackdi.sandbox(fakes,function(MySubjectClass){
        var mySubjectClass = MySubjectClass(); //with our fake subdependencies 
        var redis = require('redis'); // fake redis (why are you requiring here??)
    });
```

