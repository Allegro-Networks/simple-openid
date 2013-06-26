var assert = require('assert');

suite('Authenticate Tests');

test('Creates a new openid provider on each authentication attempt', function(){
	var openIdConnectionsCreated = 0,
		authenticationAttempts = 2,
		authenticationAttemptsCount = 0,
		mockOpenIdProviderConnectionFactory = {
			create : function(){
				openIdConnectionsCreated++;
				return fakeOpenIdProvider;
			}
		};	
	var openIdProvider = new OpenIdProvider(mockOpenIdProviderConnectionFactory);
	for(authenticationAttemptsCount;authenticationAttemptsCount < authenticationAttempts; authenticationAttemptsCount++){
		openIdProvider.authenticate({});
	}
	assert.equal(openIdConnectionsCreated, authenticationAttempts);
});

test('Creates an openId provider with correct authentciation success redirect uri', function(){
	var authenticationSuccessRedirectUri = "http://jimmy.com/here",
		providerAuthenticationSuccessRedirectUri,
		mockOpenIdProviderConnectionFactory = {
			create : function(options){
				providerAuthenticationSuccessRedirectUri = options.authenticationSuccessRedirectUri;
				return fakeOpenIdProvider;
			}
		};
	var openIdProvider = new OpenIdProvider(mockOpenIdProviderConnectionFactory);
	openIdProvider.authenticate({
		authenticationSuccessRedirectUri: authenticationSuccessRedirectUri
	});

	assert.equal(providerAuthenticationSuccessRedirectUri, authenticationSuccessRedirectUri);
});

test('Authenticates to openid provider endpoint', function(){
	var openIdAuthenticationEndpoint,
		endpoint = "http://jimmy.com/insertHere",
		mockOpenIdConnection = {
			authenticate : function(authenticateEndpoint){
				openIdAuthenticationEndpoint = authenticateEndpoint;
			}
		},
		fakeOpenIdProviderConnectionFactory = new FakeOpenIdProviderConnectionFactory(mockOpenIdConnection);

	var openIdProvider = new OpenIdProvider(fakeOpenIdProviderConnectionFactory, endpoint);
	openIdProvider.authenticate({});
	assert.equal(openIdAuthenticationEndpoint, endpoint);
});

test('Authentication does not take place immediately',function(){
	var openIdAuthenticatedImmediately,
		authenticateImmediately = false,
		mockOpenIdConnection ={
			authenticate : function(authenticateEndpoint, authenticateImmediately){
				openIdAuthenticatedImmediately = authenticateImmediately;
			}
		},
		fakeOpenIdProviderConnectionFactory = new FakeOpenIdProviderConnectionFactory(mockOpenIdConnection);

	var openIdProvider = new OpenIdProvider(fakeOpenIdProviderConnectionFactory,"");
	openIdProvider.authenticate({});
	assert.equal(openIdAuthenticatedImmediately,authenticateImmediately);
});

var FakeOpenIdProviderConnectionFactory = function(mockOpenIdConnection) {
	function create(){
		return mockOpenIdConnection;
	}
	return{
		create: create
	};
};

var fakeOpenIdProvider = {
	authenticate: function(){}
};

var OpenIdProvider = function(openIdProviderFactory,authenticationEndpoint){
	IMMEDIATELY_AUTHENTICATE = false;
	function authenticate(options){
		var openIdProvider = openIdProviderFactory.create({
			authenticationSuccessRedirectUri: options.authenticationSuccessRedirectUri
		});
		openIdProvider.authenticate(authenticationEndpoint, IMMEDIATELY_AUTHENTICATE);
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