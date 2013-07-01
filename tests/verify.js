
var assert = require('assert'),
	OpenIdVerification = require('../lib/OpenIdVerification');

suite('Verification Tests: ');
test('Request is passed into the relying party',function(){
	var relyingPartyRequest,
		request = {},
		mockRelyingParty = {
			verifyAssertation : function(request,callback){
				relyingPartyRequest = request;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockRelyingParty);

	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(request, function(){});
	assert.equal(request,relyingPartyRequest);
});

test('verifyAssertation is called on relying party',function(){
	var verifyAssertationCalled = false,
		mockRelyingParty = {
			verifyAssertation : function(){
				verifyAssertationCalled = true;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockRelyingParty);

	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(null,function(){});
	assert.equal(verifyAssertationCalled,true);
});

test('When no errors occur Then callback method is called',function(){
	var callbackCalled = false,
		callback = function(){
			callbackCalled = true;
		},
		fakeRelyingParty = {
			verifyAssertation : function(request,callback){
				callback(null,"");
			}

		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);

	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(null,callback);
	assert.equal(callbackCalled,true);
});

test('When errors occur Then error is thrown',function(){
	var error = "something bad has happened",
		fakeRelyingParty = {
			verifyAssertation : function(request,callback){
				callback(error,"");
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);

	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	assert.throws(
		function(){
			openIdVerification.verify(null,function(){});					
		},
		/something bad has happened/
	);
});

test('When no errors Then id from uri is returned in callback',function(done){
	var id = 'AItOawltwJJCOgr2XYXqOO2QQnFxfKimc-Z6psw',
		uri = 'https://www.google.com/accounts/o8/id?id=' + id,		
		fakeRelyingParty = {
			verifyAssertation : function(request,callback){
				callback(null,uri);
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(null,function(result){
		assert.equal(result,id);	
		done();	
	});	
});

test('When no errors Then id from another uri is returned in callback',function(done){
	var id = 'AItOawltwJJCOgr2XYXqOO2QQnFxfKimc-Z6psw',
		uri = 'https://www.twitter.com/accounts/bob?id=' + id,		
		fakeRelyingParty = {
			verifyAssertation : function(request,callback){
				callback(null,uri);
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(null,function(result){
		assert.equal(result,id);	
		done();	
	});	
});


var FakeRelyingPartyFactory = function(relyingParty){
	return{
		create: function(){
			return relyingParty;
		}
	};
};