var assert = require('assert'),
	OpenIdAuthenticationUriFactory = require('../lib/OpenIdAuthenticationUriFactory');

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

test('No authentication uri is generated, Then error raised', function(){
	var uri,
		fakeRelyingParty = new FakeRelyingParty(uri),
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(fakeRelyingPartyFactory);
	assert.throws(
		function(){
			openIdAuthenticationUriFactory.create({}, function(){});					
		}, 
		/Authentication uri not created by openid/
	);
});

test('Error returned from generation of uri, Then error is raised', function(){
	var error = "something bad has happened",
		uri = "aUri",		
		fakeRelyingParty = new FakeRelyingParty(uri, error),
		fakeRelyingPartyFactory = new FakeRelyingPartyFactory(fakeRelyingParty);
	var openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(fakeRelyingPartyFactory);
	assert.throws(
		function(){
			openIdAuthenticationUriFactory.create({}, function(){});					
		},
		/something bad has happened/
	);
});

var FakeRelyingPartyFactory = function(mockOpenIdConnection) {
	function create(){
		return mockOpenIdConnection;
	}
	return{
		create: create
	};
};

var FakeRelyingParty = function(returnUri, error){
	function authenticate(endpoint, immediate, callback){
		callback(error, returnUri);
	}
	return {
		authenticate : authenticate
	};
};

var fakeOpenIdProvider = {
	authenticate: function(){}
};

var OpenIdAuthenticationUriFactory = function(relyingPartyFactory){
	var IMMEDIATELY_AUTHENTICATE = false,
		NO_AUTHENTICATION_URI_GENERATED_ERROR_MESSAGE = "Authentication uri not created by openid";
	
	function create(options, callback){
		var relyingParty = relyingPartyFactory.create({
			authenticationSuccessRedirectUri: options.authenticationSuccessRedirectUri
		});
		
		relyingParty.authenticate(options.authenticationEndpoint, IMMEDIATELY_AUTHENTICATE, 
			function(uriGenerationErrors, openIdAuthenticationUri){
				checkForError(openIdAuthenticationUri, uriGenerationErrors);
				callback(openIdAuthenticationUri);
			}
		);
	}

	function checkForError(openIdAuthenticationUri, uriGenerationErrors){
		if (uriGenerationErrors){
			throw new Error(uriGenerationErrors);
		}		
		if (!openIdAuthenticationUri){
			throw new Error(NO_AUTHENTICATION_URI_GENERATED_ERROR_MESSAGE);
		}		
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