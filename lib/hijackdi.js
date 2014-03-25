var path = require('path');

module.exports = function(configuration){
	var fakeDependencies = Object.keys(configuration.fakes);
	
	fakeDependencies.forEach(function(dependency){
		var dependencyRequirePath = path.join(path.dirname(module.parent.id),dependency);
		require.cache[dependencyRequirePath].exports = configuration.fakes[dependency];
	});

	this.sandbox = function(callback){
		callback();
	};	
};