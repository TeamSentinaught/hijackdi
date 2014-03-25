require('chai').should();
var expect = require('chai').expect;

var Hijackdi = require('../lib/hijackdi.js');


test("When faked, Then fake is not the real implementation",function(done){
	var hijackdiConfig = {
		fakes: {
			'./fakeDependency.js': function(){
				done();
			}
		}
	};
	var hijackdi = new Hijackdi(hijackdiConfig);
	hijackdi.sandbox(function(){
		var fakeDependency = require('./fakeDependency.js');
		fakeDependency();
	});
});

test('When multiple items faked, Then all are all dependencies are faked',function(){
	var hijackdiConfig = {
		fakes: {
			'./fakeDependency.js': function(){
			},
			'./otherFakeDependency.js': function(){
			}
		}
	};
	var hijackdi = new Hijackdi(hijackdiConfig);
	hijackdi.sandbox(function(){
		var fakeDependency = require('./fakeDependency.js').
			otherFakeDependency = require('./otherFakeDependency.js');
			expect(function(){
				fakeDependency();
				otherFakeDependency();
			}).to.not.throw('Not stubbed/mocked');
			

	});

});