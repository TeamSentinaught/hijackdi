var RequireDependency = require('./RequireDependency'),
	IdentifierFactory = require('./IdentifierFactory');

var HijackedRequireFactory = function(subjectAbsolutePath){
	var identifierFactory = new IdentifierFactory(subjectAbsolutePath);

	this.create = function(requireIdentifier, object){
		var identifier = identifierFactory.create(requireIdentifier);
		return new RequireDependency({
			identifier : identifier,
			object : object
		});
	};
};

module.exports = HijackedRequireFactory;