var HijackedRequireFactory = require('./HijackedRequireFactory');

var HijackedRequires = function(requires, subjectAbsolutePath){
	var hijackedRequires,
		hijackedRequireFactory = new HijackedRequireFactory(subjectAbsolutePath);

	function init(){
		hijackedRequires = Object.keys(requires).map(function(requireIdentifier){
			return hijackedRequireFactory.create(requireIdentifier, requires[requireIdentifier]);
		});
	}

	this.addToCache = function(){
		hijackedRequires.forEach(function(hijackedRequire){
			hijackedRequire.addToCache();
		});
	};

	this.removeFromCache = function(){
		hijackedRequires.forEach(function(hijackedRequire){
			hijackedRequire.removeFromCache();
		});
	};

	init();
};

module.exports = HijackedRequires;