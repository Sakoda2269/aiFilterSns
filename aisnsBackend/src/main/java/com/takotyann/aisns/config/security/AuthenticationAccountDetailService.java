package com.takotyann.aisns.config.security;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.takotyann.aisns.entities.Account;

@Service
public class AuthenticationAccountDetailService implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken>{

	private static final String SECRET = System.getenv("JWT_SECRET");
	
	@Override
	public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken token) throws UsernameNotFoundException {
		DecodedJWT decodedJwt;
		try {
			decodedJwt = JWT.require(Algorithm.HMAC256(SECRET)).build().verify(token.getPrincipal().toString());
		} catch(JWTDecodeException ex) {
			throw new BadCredentialsException("Authorization header token is invalid");
		}
		if(decodedJwt.getToken().isEmpty()) {
			throw new UsernameNotFoundException("Authorization header must not be empty");
		}
		Account account = new Account();
		account.setAccountId(decodedJwt.getClaim("account_id").asString());
		account.setName(decodedJwt.getClaim("name").asString());
		account.setEmail(decodedJwt.getClaim("email").asString());
		account.setRoles(decodedJwt.getClaim("roles").asString());
		return new AccountDetails(account);
	}

}
