var path = require('path');

var HijackDI = function(subjectRequire){
	var callerDirName = path.dirname(module.parent.id);
	var subjectAbsolutePath = path.join(callerDirName, subjectRequire); 
	var mockDependenciesFactory = new MockDependenciesFactory(subjectAbsolutePath);

	this.sandbox = function(mocks, callback){
		var dependencies = mockDependenciesFactory.create(mocks);	
		dependencies.forEach(function(dependency){
			require.cache[dependency.requirePath] = dependency.mock;
		});
		delete require.cache[subjectAbsolutePath];
		var subject = require(subjectAbsolutePath);
		callback(subject);
		dependencies.forEach(function(dependency){
			delete require.cache[dependency.requirePath];
		});
		delete require.cache[subjectAbsolutePath];
	};
};

var MockDependenciesFactory = function(subjectRelativePath){
	var subjectAbsolutePathDirName = path.dirname(subjectRelativePath),
		filePath = /^\.\/.+/;
	this.create = function(mocks){
		var dependencies = Object.keys(mocks).map(function(dependency){
			var dependencyRequirePath = getDependencyRequirePath(dependency);

			return {
				requirePath : dependencyRequirePath,
				mock : {
					exports : mocks[dependency]
				}
			};
		});

		return dependencies;
	};

	function getDependencyRequirePath(dependency){
		if (dependency.match(filePath)){
			var dependencyRelativePath = path.join(subjectAbsolutePathDirName, dependency);
			return require.resolve(dependencyRelativePath);
		}
		else{
			return require.resolve(dependency);
		}
	}
};

module.exports = HijackDI;