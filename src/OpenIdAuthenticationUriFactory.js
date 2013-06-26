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

module.exports = OpenIdAuthenticationUriFactory;