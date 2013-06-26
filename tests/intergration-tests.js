var assert = require('assert');

suite('Integration Tests');

test('Creates authentication uri for google', function(done){
	var openIdAuthenticationUriFactory = require('../lib/simple-openid').OpenIdAuthenticationUriFactory,
		options = {
		authenticationEndpoint : 'https://www.google.com/accounts/o8/id',
		authenticationSuccessRedirectUri  : 'http://localhost:3000/success'
	};
	
	openIdAuthenticationUriFactory.create(options, function(uri){
		assert.ok(uri.length > 0);		
		done();
	});	
});