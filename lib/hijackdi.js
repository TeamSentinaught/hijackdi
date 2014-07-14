var path = require('path');

module.exports = function(subjectRequire){
	var testsPath = path.dirname(module.parent.id),
		subjectPath = path.join(testsPath,subjectRequire);

	this.sandbox = function(mocks, callback){
		var dependencies = bob(mocks, testsPath);	

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

	function bob(mocks, testsPath){
		var dependencies = [];
		
		Object.keys(mocks).forEach(function(dependency){
			var dependencyRequirePath = path.join(testsPath,dependency);
			dependencies.push({
				requirePath : dependencyRequirePath,
				mock : {
					exports : mocks[dependency]
				}
			});
		});

		return dependencies;
	}
};