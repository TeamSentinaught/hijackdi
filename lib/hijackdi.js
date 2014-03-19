var path = require('path');

module.exports = function(configuration){
	var firstFakeKey = Object.keys(configuration.fakes)[0];
	var absolutePath = path.join(path.dirname(module.parent.id),firstFakeKey);
	require.cache[absolutePath].exports = configuration.fakes[firstFakeKey];
	
	this.sandbox = function(callback){
		callback();
	};	
};