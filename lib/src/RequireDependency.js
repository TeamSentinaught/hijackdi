var RequireDependency = function(options){
	var identifier = options.identifier,
		object = options.object;

	this.addToCache = function(){
		require.cache[identifier] = {
			exports : object
		};
	};

	this.removeFromCache = function(){
		delete require.cache[identifier];
	};
};

module.exports = RequireDependency;