var path = require('path'),
	RequireDependency = require('./src/RequireDependency'),
	HijackedRequires = require('./src/HijackedRequires');

var HijackDI = function(subjectRequire){
	var callerDirectoryName = path.dirname(module.parent.id);
	var subjectAbsolutePath = path.join(callerDirectoryName, subjectRequire);
	var subjectRequireDependency = new RequireDependency({
		identifier : subjectAbsolutePath
	});

	this.sandbox = function(requires, callback){
		var hijackedRequires = new HijackedRequires(requires, subjectAbsolutePath);
		hijackedRequires.addToCache();
		subjectRequireDependency.removeFromCache();
		var subject = require(subjectAbsolutePath);
		callback(subject);
		hijackedRequires.removeFromCache();
		subjectRequireDependency.removeFromCache();
	};
};

module.exports = HijackDI;