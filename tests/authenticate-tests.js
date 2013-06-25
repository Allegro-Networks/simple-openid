var assert = require('assert');

suite('Authenticate Tests');

test('Creates a new openid provider on each authentication attempt', function(){
	var openIdConnectionsCreated = 0,
		authenticationAttempts = 2,
		authenticationAttemptsCount = 0,
		mockOpenIdProviderConnectionFactory = {
			create : function(){
				openIdConnectionsCreated++;
			}
		};	
	var openIdProvider = new OpenIdProvider(mockOpenIdProviderConnectionFactory);
	for(authenticationAttemptsCount;authenticationAttemptsCount < authenticationAttempts; authenticationAttemptsCount++){
		openIdProvider.authenticate();
	}
	assert.equal(openIdConnectionsCreated, authenticationAttempts);
});



var OpenIdProvider = function(openIdProviderFactory){
	function authenticate(){
		openIdProviderFactory.create();
	}
	return{
		authenticate: authenticate
	};
};
// module.exports.Bob = function(){

// }


// module.exports = function(){

// }

// var Authenticate = require('bob').Authenticate;
// var authnetication = require('bob');

// var bobs1 = simpleOpenId.AuthenticateFactory.create({});

// var bob1 = new authentication.Authenticate(openIdFactory.create());