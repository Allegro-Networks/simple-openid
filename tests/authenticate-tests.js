var assert = require('assert');

suite('Authenticate Tests');

test('Creates a new openid provider on each create of openid authentication uri', function(){
	var relyingPartiesCreated = 0,
		callsToCreateOpenIdAuthenticationUri = 2,
		createOpenIdAuthenticationUriCount = 0,
		mockRelyingPartyFactory = {
			create : function(){
				relyingPartiesCreated++;
				return fakeOpenIdProvider;
			}
		};	
	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(mockRelyingPartyFactory);
	for(createOpenIdAuthenticationUriCount;createOpenIdAuthenticationUriCount < callsToCreateOpenIdAuthenticationUri; createOpenIdAuthenticationUriCount++){
		openIdAuthenticationUriFactory.create({});
	}
	assert.equal(relyingPartiesCreated, callsToCreateOpenIdAuthenticationUri);
});

test('Creates a relying party with correct authentication success redirect uri', function(){
	var authenticationSuccessRedirectUri = "http://jimmy.com/here",
		relyingPartyAuthenticationSuccessRedirectUri,
		mockRelyingPartyFactory = {
			create : function(options){
				relyingPartyAuthenticationSuccessRedirectUri = options.authenticationSuccessRedirectUri;
				return fakeOpenIdProvider;
			}
		};
	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(mockRelyingPartyFactory);
	openIdAuthenticationUriFactory.create({
		authenticationSuccessRedirectUri: authenticationSuccessRedirectUri
	});

	assert.equal(relyingPartyAuthenticationSuccessRedirectUri, authenticationSuccessRedirectUri);
});

test('Authenticate called on relying party with openid provider endpoint', function(){
	var openIdAuthenticationEndpoint,
		endpoint = "http://jimmy.com/insertHere",
		mockOpenIdConnection = {
			authenticate : function(authenticateEndpoint){
				openIdAuthenticationEndpoint = authenticateEndpoint;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);

	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(fakeRelyingPartyFactory);
	openIdAuthenticationUriFactory.create({
		authenticationEndpoint : endpoint
	});
	assert.equal(openIdAuthenticationEndpoint, endpoint);
});

test('Authenticate on relying party not set to immediately',function(){
	var openIdAuthenticatedImmediately,
		authenticateImmediately = false,
		mockOpenIdConnection ={
			authenticate : function(authenticateEndpoint, authenticateImmediately){
				openIdAuthenticatedImmediately = authenticateImmediately;
			}
		},
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(mockOpenIdConnection);

	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(fakeRelyingPartyFactory);
	openIdAuthenticationUriFactory.create({});
	assert.equal(openIdAuthenticatedImmediately,authenticateImmediately);
});

test('Generation of authentication uri successful, callback triggered with open id authenication uri', function(done){
	var uri = "http://google.com/openid/auth/etc",
		fakeRelyingParty = new FakeRelyingParty(uri),
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(fakeRelyingPartyFactory);
	openIdAuthenticationUriFactory.create({}, function(openIdAuthenticationUri){		
		assert.equal(openIdAuthenticationUri, uri);
		done();
	});
});

var FakeRelyingPartyFactory = function(mockOpenIdConnection) {
	function create(){
		return mockOpenIdConnection;
	}
	return{
		create: create
	};
};

var FakeRelyingParty = function(returnUri){
	function authenticate(endpoint, immediate, callback){
		callback(undefined, returnUri);
	}
	return {
		authenticate : authenticate
	};
};

var fakeOpenIdProvider = {
	authenticate: function(){}
};

var OpenIdAuthenticationUriFactory = function(relyingPartyFactory){
	IMMEDIATELY_AUTHENTICATE = false;
	function create(options, callback){
		var relyingParty = relyingPartyFactory.create({
			authenticationSuccessRedirectUri: options.authenticationSuccessRedirectUri
		});
		relyingParty.authenticate(options.authenticationEndpoint, IMMEDIATELY_AUTHENTICATE, function(error, openIdAuthenticationUri){
			callback(openIdAuthenticationUri);
		});
	}

	return{
		create: create
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