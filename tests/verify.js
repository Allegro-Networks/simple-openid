var assert = require('assert'),
	OpenIdAuthenticationUriFactory = require('../lib/OpenIdAuthenticationUriFactory');

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
				callback(null,{});
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
				callback(error,{});
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

test('When no errors Then result is passed into the callback',function(){
	var result = "Hello Jimmy",
		callbackResult,
		callback = function(result){
			callbackResult = result;
		},
		fakeRelyingParty = {
			verifyAssertation : function(request,callback){
				callback(null,result);
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(null,callback);
	assert.equal(result,callbackResult);
});


var FakeRelyingPartyFactory = function(relyingParty){
	return{
		create: function(){
			return relyingParty;
		}
	};
};

var OpenIdVerification = function(relyingPartyFactory){
	var relyingParty = relyingPartyFactory.create();
	
	function checkErrors(errors){
		if(errors){
			throw new Error(errors);
		}
	}

	function verify(request,callback){
		relyingParty.verifyAssertation(request,function(errors,result){
			checkErrors(errors);
			callback(result);
		});
		
	}
	return{
		verify: verify
	};
};




