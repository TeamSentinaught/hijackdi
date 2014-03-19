module.exports = function(configuration){
	var firstFakeKey = Object.keys(configuration.fakes)[0];
	var absolutePath = require.resolve(configuration.base + '/' + firstFakeKey);
	require.cache[absolutePath].exports = configuration.fakes[firstFakeKey];
	
	this.sandbox = function(callback){
		callback();
	};	
};