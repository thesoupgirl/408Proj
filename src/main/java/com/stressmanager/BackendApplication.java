package com.stressmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.security.oauth2.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;




import java.security.Principal;



@SpringBootApplication
@EnableOAuth2Sso
@RestController
public class BackendApplication extends WebSecurityConfigurerAdapter {

	// @Override
	// protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
	// 	return application.sources(BackendApplication.class);
	// }
	@RequestMapping("/user")
	public Principal user(Principal principal) {
  		return principal;
	}
	@Override
	protected void configure(HttpSecurity http) throws Exception {
  		http
		.antMatcher("/**")
		.authorizeRequests()
	  	.antMatchers("/", "/login**", "/webjars/**")
	  	.permitAll()
		.anyRequest()
	  	.authenticated();
	}


	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
