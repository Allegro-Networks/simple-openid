var assert = require('assert'),
	OpenIdAuthenticationUriFactory = require('../lib/OpenIdAuthenticationUriFactory');

suite('Verify');

test('When created Then relying party is created',function(){
	var relyingPartyCreated = false,
		mockRelyingPartyFactory = {
			create: function(){
				relyingPartyCreated = true;
			}
		};

	var jimmy = new Jimmy(mockRelyingPartyFactory);

	assert.equal(relyingPartyCreated, true);
});

test('When verify Then verifyAssertation is called on openIDConnection',function(){
	var verifyAssertationCalled = false,
		mockOpenIdConnection = {
			verifyAssertation : function(){
				verifyAssertationCalled = true;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);
	var jimmy = new Jimmy(fakeRelyingPartyFactory);
	jimmy.verify(function(){});
	assert.equal(verifyAssertationCalled,true);
});

test('When verify called And no errors occur Then callback method is called',function(){
	var callbackCalled = false,
		callback = function(){
			callbackCalled = true;
		},
		mockOpenIdConnection = {
			verifyAssertation : function(callback){
				callback(undefined,{});
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);
	var jimmy = new Jimmy(fakeRelyingPartyFactory);
	jimmy.verify(callback);
	assert.equal(callbackCalled,true);
});

var FakeRelyingPartyFactory = function(openIdConnection){
	return{
		create: function(){
			return openIdConnection;
		}
	};
};

var Jimmy = function(relyingPartyFactory){
	var relyingParty = relyingPartyFactory.create();
	
	function verify(callback){
		relyingParty.verifyAssertation(function(errors){
			if(!errors){
				callback();
			}
		});
		
	}
	return{
		verify: verify
	};
};




