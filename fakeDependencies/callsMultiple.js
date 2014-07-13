var fakeDependency = require('./fakeDependency.js'),
	otherFakeDependency = require('./otherFakeDependency.js');

module.exports = function(){
	otherFakeDependency();
	fakeDependency();
};