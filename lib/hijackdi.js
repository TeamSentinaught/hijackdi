var path = require('path');

var HijackDI = function(subjectRequire){
	var subjectPath = require.resolve(subjectRequire),
		mockDependenciesFactory = new MockDependenciesFactory();

	this.sandbox = function(mocks, callback){
		var dependencies = mockDependenciesFactory.create(mocks);	
		dependencies.forEach(function(dependency){
			require.cache[dependency.requirePath] = dependency.mock;
		});
		delete require.cache[subjectPath];
		var subject = require(subjectPath);
		callback(subject);
		dependencies.forEach(function(dependency){
			delete require.cache[dependency.requirePath];
		});
		delete require.cache[subjectPath];
	};
};

var MockDependenciesFactory = function(){
	this.create = function(mocks){
		var dependencies = Object.keys(mocks).map(function(dependency){
			var dependencyRequirePath = require.resolve(dependency);
			return {
				requirePath : dependencyRequirePath,
				mock : {
					exports : mocks[dependency]
				}
			};
		});

		return dependencies;
	};
};

module.exports = HijackDI;