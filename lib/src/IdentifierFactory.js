var path = require('path');

var IdentifierFactory = function(subjectAbsolutePath){
	var IS_RELATIVE_FILE_PATH = /^\.\/.+/;
	var subjectAbsoluteDirectoryName = path.dirname(subjectAbsolutePath);

	this.create = function(requireIdentifier){
		if (requireIdentifier.match(IS_RELATIVE_FILE_PATH)){
			requireIdentifier = path.join(subjectAbsoluteDirectoryName, requireIdentifier);
		}
		return require.resolve(requireIdentifier);
	};
};

module.exports = IdentifierFactory;