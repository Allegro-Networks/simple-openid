var RelyingPartyFactory = require('./RelyingPartyFactory.js'),
	OpenIdAuthenticationUriFactory = require('./OpenIdAuthenticationUriFactory'),
	openIdAuthenticationUriFactory = new OpenIdAuthenticationUriFactory(new RelyingPartyFactory());

module.exports.OpenIdAuthenticationUriFactory = openIdAuthenticationUriFactory;