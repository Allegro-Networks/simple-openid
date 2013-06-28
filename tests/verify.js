var assert = require('assert'),
	OpenIdAuthenticationUriFactory = require('../lib/OpenIdAuthenticationUriFactory');

suite('Verification Tests: ');

test('When initialized Then relying party is created',function(){
	var relyingPartyCreated = false,
		mockRelyingPartyFactory = {
			create: function(){
				relyingPartyCreated = true;
			}
		};

	var jimmy = new OpenIdVerification(mockRelyingPartyFactory);

	assert.equal(relyingPartyCreated, true);
});

test('Then verifyAssertation is called on openIDConnection',function(){
	var verifyAssertationCalled = false,
		mockOpenIdConnection = {
			verifyAssertation : function(){
				verifyAssertationCalled = true;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);
	var jimmy = new OpenIdVerification(fakeRelyingPartyFactory);
	jimmy.verify(null,function(){});
	assert.equal(verifyAssertationCalled,true);
});

test('When no errors occur Then callback method is called',function(){
	var callbackCalled = false,
		callback = function(){
			callbackCalled = true;
		},
		mockOpenIdConnection = {
			verifyAssertation : function(request,callback){
				callback(null,{});
			}

		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);
	var jimmy = new OpenIdVerification(fakeRelyingPartyFactory);
	jimmy.verify(null,callback);
	assert.equal(callbackCalled,true);
});

test('When errors occur Then error is thrown',function(){
	var error = "something bad has happened",
		mockOpenIdConnection = {
			verifyAssertation : function(request,callback){
				callback(error,{});
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);

	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	assert.throws(
		function(){
			openIdVerification.verify(null,function(){});					
		},
		/something bad has happened/
	);
});

test('Request is passed into the relying party',function(){
	var relyingPartyRequest,
		request = {},
		mockOpenIdConnection = {
			verifyAssertation : function(request,callback){
				relyingPartyRequest = request;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);
	var openIdVerification = new OpenIdVerification(fakeRelyingPartyFactory);
	openIdVerification.verify(request, function(){});
	assert.equal(request,relyingPartyRequest);
});

var FakeRelyingPartyFactory = function(openIdConnection){
	return{
		create: function(){
			return openIdConnection;
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
		relyingParty.verifyAssertation(request,function(errors){
			checkErrors(errors);
			callback();
		});
		
	}
	return{
		verify: verify
	};
};




