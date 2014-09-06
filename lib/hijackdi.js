var path = require('path');

var HijackDI = function(subjectRequire){
	var callerDirectoryName = path.dirname(module.parent.id);
	var subjectAbsolutePath = path.join(callerDirectoryName, subjectRequire); 
	var requiresFactory = new ReplacementRequiresFactory(subjectAbsolutePath);
	var subjectRequireDependency = new RequireDependency({
		identifier : subjectAbsolutePath
	});

	this.sandbox = function(requires, callback){
		var replacementRequires = requiresFactory.create(requires);	
		replacementRequires.forEach(function(dependency){
			dependency.addToCache();
		});
		subjectRequireDependency.removeFromCache();
		var subject = require(subjectAbsolutePath);
		callback(subject);
		replacementRequires.forEach(function(dependency){
			dependency.removeFromCache();
		});
		subjectRequireDependency.removeFromCache();
	};
};

var ReplacementRequiresFactory = function(subjectAbsolutePath){
	var requirePathFactory = new RequirePathFactory(subjectAbsolutePath);
	
	this.create = function(requires){
		var dependencies = Object.keys(requires).map(function(dependency){
			var dependencyRequirePath = requirePathFactory.resolve(dependency);
			return new RequireDependency({
				identifier : dependencyRequirePath,
				object : requires[dependency]
			});
		});

		return dependencies;
	};
};

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

var RequirePathFactory = function(subjectAbsolutePath){
	var IS_RELATIVE_FILE_PATH = /^\.\/.+/;
	var subjectAbsoluteDirectoryName = path.dirname(subjectAbsolutePath);

	this.resolve = function(requireIdentifier){
		if (requireIdentifier.match(IS_RELATIVE_FILE_PATH)){
			requireIdentifier = path.join(subjectAbsoluteDirectoryName, requireIdentifier);
		}
		return require.resolve(requireIdentifier);
	};
};

module.exports = HijackDI;