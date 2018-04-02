package com.stressmanager;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.*;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.*;


import javax.servlet.Filter;

import org.junit.Test;
import org.testng.Assert;
import org.junit.Rule;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.util.Base64Utils;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.rule.OutputCapture;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.*;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.security.test.context.support.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.config.annotation.web.servlet.configuration.*;
import org.springframework.security.config.annotation.authentication.builders.*;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.context.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.boot.test.autoconfigure.web.servlet.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.*;
import static org.hamcrest.Matchers.*;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationProcessingFilter;



@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
@ContextConfiguration
public class BackendApplicationTests extends AbstractTestNGSpringContextTests {

    @LocalServerPort
	private int port;

    @Autowired
    BackendApplication controller;

    @Autowired
    WebApplicationContext wac;

    @Autowired
    private Filter springSecurityFilterChain;

    MockMvc mvc;

    OAuth2AuthenticationProcessingFilter oauth;

    @Before
    public void setup() {
        System.out.println("TESTS ARE ACTUALLY RUNNING!!");
        mvc = webAppContextSetup(wac)
                .addFilters(springSecurityFilterChain)
                .apply(springSecurity())
                .build();
    }

    @Test
	public void homeNotNullTest() {
        System.out.println("\nRunnning test case 1: Checking that maincontroller is working.");
        Assert.assertNotNull(controller);
	}
    @Test
	public void checkHomePageTest() throws Exception{
        System.out.println("\nRunnning test case 2: Checking that HomePage loads up.");
        this.mvc.perform(get("/"))
                .andExpect(status().isOk());

    }
    @Test
    public void RedirectTest() throws Exception{
        System.out.println("\nRunnning test case 3: Redirect Test.");
        HttpStatus stats = new TestRestTemplate("30354291750-bs651utajfcpf0a5outo8nqnmd8thm86.apps.googleusercontent.com", "8BrM4VbRR5dgYlinrySTKNU5")
            .getForEntity("http://localhost:"+port+"/login/google", String.class).getStatusCode();
        System.out.println("\n\n   The Status:"+stats);
        Assert.assertEquals(
				HttpStatus.FOUND == stats,
                true);


    }
    @Test
    @WithMockUser
    public void PingTestUnauthorized() throws Exception{
        System.out.println("\n\nRunnning test case 4: Ping Test(Unauth)\n");
        mvc.perform(get("/ping"))
            .andExpect(status().isMovedTemporarily())
            .andExpect(redirectedUrl("http://localhost/"));

    }
    @Test
    @WithMockUser
    public void PingTestAuthorized() throws Exception{
        System.out.println("\n\nRunnning test case 5: Ping Test(Auth)\n");
        // mvc.perform(formLogin("/login/google"))
        //     .andExpect(status().isMovedTemporarily())
        //     .andExpect(redirectedUrl("http://localhost/"));

    }
    @Test
	public void DBSetUpLocalTest() throws Exception{
        System.out.println("\nRunnning test case 7: Checking that the Local DB is setup.");
        DBSetup.localDB();
	}
    @Test
	public void DBSetUpRemoteTest() throws Exception{
        System.out.println("\nRunnning test case 8: Checking that the Remote DB is setup.");
        DBSetup.remoteDB();
	}
    @Test
	public void DBSetUpRemoteTestCreateTable() throws Exception{
        System.out.println("\nRunnning test case 9: Checking that the Remote DB can make table.");
        DBSetup.remoteDB();
        int err = DBSetup.createTable("Test_Table");
        Assert.assertEquals(err == 200,true);
        Table re = DBSetup.getTable("Test_Table");
        re.delete();

	}
    @Test
	public void DBSetUpRemoteTestUserTableGet() throws Exception{
        System.out.println("\nRunnning test case 10: Checking that the Remote DB can Get.");
        DBSetup.remoteDB();
        Table re = DBSetup.getUsersTable();
        Assert.assertEquals(re != null,true);

	}
    @Test
	public void TestMeRoute() throws Exception{
        System.out.println("\nRunnning test case 12: Checking that the /me route worked.");
        mvc.perform(get("/me"))
            .andExpect(status().isMovedTemporarily())
            .andExpect(redirectedUrl("http://localhost/"));
	}
    @Test
	public void TestAdviceRoute() throws Exception{
        System.out.println("\nRunnning test case 13: Checking that the route /advice works.");
        mvc.perform(get("/advice"))
            .andExpect(status().isOk());

	}

    @Test
    public void TestOutlookRoute() throws Exception{
        System.out.println("\nRunnning test case 14: Checking that the route /outlooksignin works.");
        mvc.perform(get("/outlooksigin"))
            .andExpect(status().isMovedTemporarily());

    }



    private String getAccessToken(String username, String password) throws Exception {
		String authorization = "Basic "
				+ new String(Base64Utils.encode("clientapp:123456".getBytes()));
		String contentType = MediaType.APPLICATION_JSON + ";charset=UTF-8";

		// @formatter:off
		String content = mvc
				.perform(
						post("/oauth/authorize")
								.header("Authorization", authorization)
								.contentType(
										MediaType.APPLICATION_FORM_URLENCODED)
								.param("username", username)
								.param("password", password)
								.param("grant_type", "password")
								.param("scope", "read write")
								.param("client_id", "clientapp")
								.param("client_secret", "123456"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(contentType))
				.andExpect(jsonPath("$.access_token", is(notNullValue())))
				.andExpect(jsonPath("$.token_type", is(equalTo("bearer"))))
				.andExpect(jsonPath("$.refresh_token", is(notNullValue())))
				.andExpect(jsonPath("$.expires_in", is(greaterThan(4000))))
				.andExpect(jsonPath("$.scope", is(equalTo("read write"))))
				.andReturn().getResponse().getContentAsString();

		// @formatter:on

		return content.substring(17, 53);
	}


}
