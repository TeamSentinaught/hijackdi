var path = require('path');

module.exports = function(subjectRequire){
	var testsPath = path.dirname(module.parent.id),
		subjectPath = path.join(testsPath,subjectRequire);

	

	this.sandbox = function(mocks,callback){
		var fakeDependencies = Object.keys(mocks);
		
		fakeDependencies.forEach(function(dependency){
			var dependencyRequirePath = path.join(testsPath,dependency);
			require.cache[dependencyRequirePath] = {exports:mocks[dependency]};
		});

		var subject = require(subjectPath);
		callback(subject);
		// fakeDependencies.forEach(function(dependency){
		// 	var dependencyRequirePath = path.join(testsPath,dependency);
		// 	delete require.cache[dependencyRequirePath];
		// });
	};	
};