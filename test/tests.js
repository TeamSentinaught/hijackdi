/*jshint expr:true*/
var expect = require('chai').expect;
var Hijackdi = require('../lib/hijackdi.js');
var callsOneDependency = require('./fakeDependencies/callsOneDependency.js');
					
test('When one item is faked, Then dependency is faked',function(done){
	var mocks =  {
			'./fakeDependency': function(){}
		};
	var hijackdi = new Hijackdi('./fakeDependencies/callsOneDependency.js');
	hijackdi.sandbox(mocks,function(subject){
		expect(function(){
				subject();
			}).to.not.throw('Not stubbed/mocked');
		done();
	});
});

test('When multiple items faked, Then all are all dependencies are faked',function(done){
	var mocks =  {
			'./fakeDependency.js': function(){},
			'./otherFakeDependency.js': function(){}
		};
	var hijackdi = new Hijackdi('./fakeDependencies/callsMultipleDependencies.js');
	hijackdi.sandbox(mocks,function(subject){
		expect(function(){
				subject();
			}).to.not.throw('Not stubbed/mocked');
		done();
	});
});

test('When item is faked, outside sandbox item acts as normal',function(){
	var mocks = {
		'./fakeDependency.js': function(){
		}};
	var hijackdi = new Hijackdi('./fakeDependencies/callsOneDependency.js');
	hijackdi.sandbox(mocks,function(subject){
	});
	expect(function(){ 
		callsOneDependency();
	}).to.throw('Not stubbed/mocked');
});

test('When node_module is faked and subject has been previously required, then sandbox environment works correctly',function(){
	var mocks = {
			'true': function(){ return false;}
		},
		before = require('./fakeDependencies/returnsTrue.js'),
		hijackdi = new Hijackdi('./fakeDependencies/returnsTrue.js');
	
	hijackdi.sandbox(mocks,function(subject){
		expect(subject.value).to.be.false;
	});
	expect(before.value).to.be.true;
});

test('When node_module is faked and subject is required later, then sandbox environment works correctly',function(){
	var mocks = {
			'true': function(){ return false;}
		},
		hijackdi = new Hijackdi('./fakeDependencies/returnsTrue.js');
	
	hijackdi.sandbox(mocks,function(subject){
		expect(subject.value).to.be.false;
	});
	var later = require('./fakeDependencies/returnsTrue.js');
	expect(later.value).to.be.true;
});