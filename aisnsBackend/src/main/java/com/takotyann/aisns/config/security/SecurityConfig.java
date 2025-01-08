package com.takotyann.aisns.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AccountStatusUserDetailsChecker;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.takotyann.aisns.config.security.filter.JwtCreateFilter;
import com.takotyann.aisns.config.security.filter.JwtRequestHeaderAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	public void configureProvider(
			AuthenticationManagerBuilder auth, 
			AccountDetailService accountDetailsService, 
			AuthenticationAccountDetailService authenticationAccountDetailService
		) {
		PreAuthenticatedAuthenticationProvider preAuthProv = new PreAuthenticatedAuthenticationProvider();
		preAuthProv.setPreAuthenticatedUserDetailsService(authenticationAccountDetailService);
		preAuthProv.setUserDetailsChecker(new AccountStatusUserDetailsChecker());
		auth.authenticationProvider(preAuthProv);
		DaoAuthenticationProvider daoAuthProv = new DaoAuthenticationProvider();
		daoAuthProv.setUserDetailsService(accountDetailsService);
		daoAuthProv.setPasswordEncoder(new BCryptPasswordEncoder(8));
		auth.authenticationProvider(daoAuthProv);
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(8);
	}
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		AuthenticationManager authManager = authenticationManager(http.getSharedObject(AuthenticationConfiguration.class));
		http
		.csrf(csrf -> 
			csrf.ignoringRequestMatchers("/api/**")
		)
		.authorizeHttpRequests(authz ->
			authz.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.POST, "/api/login")).permitAll()
			.requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.POST, "/api/accounts/signup")).permitAll()
			.anyRequest().authenticated()
		)
		.addFilter(new JwtCreateFilter(authManager))
		.addFilter(new JwtRequestHeaderAuthenticationFilter(authManager))
		.sessionManagement(session -> 
			session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		)
		;
		return http.build();
	}
	
	
}
