var OpenIdVerification = function(relyingPartyFactory){
	var relyingParty = relyingPartyFactory.create();
	
	function checkErrors(errors){
		if(errors){
			throw new Error(errors);
		}
	}

	function verify(request,callback){
		relyingParty.verifyAssertation(request,function(errors,result){
			checkErrors(errors);
			callback(result);
		});
		
	}
	return{
		verify: verify
	};
};

module.exports = OpenIdVerification;