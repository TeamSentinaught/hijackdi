require('chai').should();
var Hijackdi = require('../lib/hijackdi.js');


test("When faked, Then fake is not the real implementation",function(done){
	var hijackdiConfig = {
		base: __dirname,
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