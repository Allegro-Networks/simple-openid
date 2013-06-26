var openid = require('openid');

var RelyingPartyFactory = function() {
	var REALM = null,
		stateless = false,
		strictMode = false,
		extensions = null;

	function create(options){
		return new openid.RelyingParty(
        	options.authenticationSuccessRedirectUri,
        	REALM, stateless, 
        	strictMode, extensions);        	
	}
	return{
		create: create
	};
};

module.exports = RelyingPartyFactory;