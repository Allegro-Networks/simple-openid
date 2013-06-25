var assert = require('assert');

suite('Authenticate Tests');

test('Jimmy', function(){
  
  assert.equal(true, true);
});

test('Creates a new openid provider', function(){
	var openIdProviderConnectionCreated = false,
		mockOpenIdProviderConnectionFactory = {
			create : function(){
				openIdProviderConnectionCreated = true;
			}
		};	
	var openIdProvider = new OpenIdProvider(mockOpenIdProviderConnectionFactory);
	openIdProvider.authenticate();
	assert.equal(openIdProviderConnectionCreated, true);
});


var OpenIdProvider = function(openIdProviderFactory){
	openIdProviderFactory.create();
	return{
		authenticate: function(){}
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