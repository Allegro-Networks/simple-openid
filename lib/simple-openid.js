var RelyingPartyFactory = require('./RelyingPartyFactory.js'),
	relyingPartyFactory = new RelyingPartyFactory(),
	OpenIdAuthenticationUriFactory = require('./OpenIdAuthenticationUriFactory'),
	OpenIdVerification = require('./OpenIdVerification'),
	openIdVerification = new OpenIdVerification(relyingPartyFactory),
	openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(relyingPartyFactory);


module.exports.OpenIdAuthenticationUriFactory = openIdAuthenticationUriFactory;
module.exports.OpenIdVerification = openIdVerification;