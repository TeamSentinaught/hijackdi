var path = require('path');

var HijackDI = function(subjectRequire){
	var testsPath = path.dirname(module.parent.id),
		subjectPath = path.join(testsPath,subjectRequire),
		mockDependenciesFactory = new MockDependenciesFactory(testsPath);

	this.sandbox = function(mocks, callback){
		var dependencies = mockDependenciesFactory.create(mocks);	

		dependencies.forEach(function(dependency){
			require.cache[dependency.requirePath] = dependency.mock;
		});

		var subject = require(subjectPath);
		callback(subject);

		dependencies.forEach(function(dependency){
			delete require.cache[dependency.requirePath];
		});
		delete require.cache[subjectPath];
	};
};

var MockDependenciesFactory = function(testsPath){
	this.create = function(mocks){
		var dependencies = Object.keys(mocks).map(function(dependency){
			var dependencyRequirePath = path.join(testsPath,dependency);
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