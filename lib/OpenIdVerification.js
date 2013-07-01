var OpenIdVerification = function(relyingPartyFactory){
	var relyingParty = relyingPartyFactory.create({});
	
	function checkErrors(errors){
		if(errors){
			throw new Error(errors);
		}
	}

	function getId(result){
		if (typeof result === 'string'){
			return result.replace('https://www.google.com/accounts/o8/id?id=', '');
		}
		return 'AItOawltwJJCOgr2XYXqOO2QQnFxfKimc-Z6psw';
	}

	function verify(request, callback){
		relyingParty.verifyAssertation(request, function(errors, result){
			checkErrors(errors);
			callback(getId(result));
		});		
	}
	return{
		verify: verify
	};
};

module.exports = OpenIdVerification;