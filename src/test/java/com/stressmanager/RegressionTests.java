package com.stressmanager;

import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import com.amazonaws.services.dynamodbv2.document.*;

import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;


import org.springframework.boot.test.context.SpringBootTest;
@RunWith(SpringRunner.class)
@SpringBootTest
@ConfigurationProperties(prefix="testing")
public class RegressionTests {
	@Autowired
	private WebApplicationContext context;

	private MockMvc mockMvc;
	private String clientId;
	private String clientSecret;
	@Before
    public void setUp() {
         mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
         //mockResources = MockMvcBuilders.standaloneSetup(new ClientResources().build());
         clientId = System.getenv("GOOGLE_CLIENT_ID");
		 clientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
    }
    @Test
	public void signInRedirects() throws Exception {
		 this.mockMvc.perform(get("/login/google/"))
                     .andExpect(status().isMovedTemporarily())
                     .andDo(print());

	}
	@Test
	public void DBSetUpRemoteTestUserTableAdd() throws Exception{
		System.out.println("\nRunnning test case 11: Checking that the Remote DB can Put item"+Colors.ANSI_BLUE);
		DBSetup.remoteDB();
		Table re = DBSetup.getUsersTable();
		Item im = new Item();
		im.withString("username","Test_User");
		im.withString("calID","Test_cal");
		re.putItem(im);

	}

	private AuthorizationCodeResourceDetails client = new AuthorizationCodeResourceDetails();
	@Bean
	@ConfigurationProperties("google")
	public ClientResources google() {
		System.out.println("RESOURCE BEING MADE");
		return new ClientResources();
	}

	public void generateNewClientIdAndSecret() {
		String nclientId = System.getenv("GOOGLE_CLIENT_ID_TEST");
		String nclientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
		//System.out.println("Meow " + nclientId);
		assertTrue("client secret and id are not retrieved from env", !nclientId.equals(clientId));
	}
}
