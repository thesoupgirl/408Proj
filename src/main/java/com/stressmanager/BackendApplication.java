package com.stressmanager;

import java.security.Principal;
import java.util.*;

import io.jsonwebtoken.*;

import javax.crypto.spec.SecretKeySpec;

import javax.servlet.Filter;
import javax.servlet.http.*;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.client.util.store.MemoryDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;

import org.springframework.web.client.RestTemplate;

import com.google.api.client.http.HttpTransport;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.auth.oauth2.*;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.*;
import com.google.api.client.json.*;
import org.springframework.security.core.*;
import org.springframework.security.web.authentication.preauth.RequestHeaderAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.autoconfigure.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.filter.CompositeFilter;
import org.springframework.boot.autoconfigure.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;

import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;

import com.amazonaws.services.dynamodbv2.document.*;
import com.amazonaws.services.dynamodbv2.document.spec.*;
import com.amazonaws.services.dynamodbv2.model.*;

import com.google.gson.*;
import com.google.gson.reflect.*;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.FileReader;

@RestController
@EnableOAuth2Client
@EnableAuthorizationServer
@SpringBootApplication
@EnableAutoConfiguration
@Order(6)
public class BackendApplication extends WebSecurityConfigurerAdapter {

    @Autowired
    public OAuth2ClientContext oauth2ClientContext;


	@Value("${google.client.clientId}")
	static String clientID;

	@Value("${google.client.clientSecret}")
	static String clientSecret;

    private static String email = "";

	static String access = "";

    DBHelper db = new DBHelper();
    private Map<String, String> dbCreds = new LinkedHashMap<>();
    private Map<String, GoogleIdToken> googleCreds = new LinkedHashMap<>();

    //static Credentials credz;

    static com.google.api.services.calendar.Calendar service;

    @RequestMapping({"/androidlogin"})
    @ResponseBody
    public ResponseEntity<String> androidLogin(@RequestHeader String androidIdToken) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        access = "";
        email = "";
        String userId = "";
        httpHeaders.setContentType(MediaType.TEXT_PLAIN);
        System.out.println("\narf\n\n" +androidIdToken);

        if (androidIdToken == null) {
            String nope = "No token...";
            return new ResponseEntity<String>(nope, httpHeaders, HttpStatus.BAD_REQUEST);
        }

        final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
        HttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

		GoogleClientSecrets clientSecrets =
    	   GoogleClientSecrets.load(
        	JacksonFactory.getDefaultInstance(), new FileReader("client_secrets.json"));
    	GoogleTokenResponse tokenResponse =
      		new GoogleAuthorizationCodeTokenRequest(
              HTTP_TRANSPORT,
              JSON_FACTORY,
              "https://www.googleapis.com/oauth2/v4/token",
              clientSecrets.getDetails().getClientId(),
              clientSecrets.getDetails().getClientSecret(),
              androidIdToken,
              "https://theepstein.herokuapp.com/login/google")  // Specify the same redirect URI that you use with your web
                             // app. If you don't have a web version of your app, you can
                             // specify an empty string.
              .execute();

		String accessToken = tokenResponse.getAccessToken();
		access = accessToken;

		// Use access token to call API
		GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);
		com.google.api.services.calendar.Calendar service = new com.google.api.services.calendar.Calendar.Builder(
			HTTP_TRANSPORT, JSON_FACTORY, credential)
			.setApplicationName("Epstein")
			.build();

		DateTime now = new DateTime(System.currentTimeMillis());

		Events events = service.events().list("primary")
			.setMaxResults(50)
			.setTimeMin(now)
			.setSingleEvents(false)
			.execute();

		List<Event> items = events.getItems();
		if (items.size() == 0) {
			System.out.println("No upcoming events found.");
		}
		else {
			System.out.println(Colors.ANSI_PURPLE+"Upcoming events (Me route)"+Colors.ANSI_WHITE);
			for (Event event : items) {
				String str = event.getId();
				System.out.printf("%s (%s)\n", str, event.getSummary());
			}

		}

		// Get profile info from ID token
		GoogleIdToken idToken = tokenResponse.parseIdToken();
		GoogleIdToken.Payload payload = idToken.getPayload();
		userId = payload.getSubject();  // Use this value as a key to identify a user.
		email = payload.getEmail();
		email = email.replace("@", "");
		boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
		String name = (String) payload.get("name");
		String pictureUrl = (String) payload.get("picture");
		String locale = (String) payload.get("locale");
		String familyName = (String) payload.get("family_name");
		String givenName = (String) payload.get("given_name");

		DBSetup.remoteDB();

		//check if the Table for that UserName exists
		Table tab = DBSetup.getTable(email);
		if(tab == null) { //the Table doesn't Exist!!!
			System.out.println("Creating a table for "+ email +"\'s events");
			//make the table! :D
			DBSetup.createTable(email);
		}

		tab = DBSetup.getUsersTable();
		tab.putItem(new Item().withString("username", email)
            .withString("calID","primary")
            .withString("token",accessToken)
            .withString("idtoken", androidIdToken));


		return new ResponseEntity<String>(accessToken, httpHeaders, HttpStatus.ACCEPTED);
	}

	//We have a separate validation for tokens for Android users, since this is stored in the db.
	public boolean validateAndroidToken(String token, String emailo) {
		//String user = dbCreds.get(token);

		DBSetup.remoteDB();

		System.out.println("email..." + emailo);
		System.out.println("fucking token: " + token);

		Table tab = DBSetup.getUsersTable();
		System.out.println("meow: " + emailo);
		GetItemSpec spec = new GetItemSpec()
			   .withPrimaryKey("username", emailo);
		Item got = tab.getItem(spec);
		String dbToken = (String) got.get("token");
		System.out.println("Dynamo token: " + dbToken);
		System.out.println("Compared with...this token: " + token);

		if(token.equals(dbToken)) {
			return true;
		}
		return false;
	}

	//set up the access token and check that is works
	@RequestMapping({ "/user", "/me" })
	@ResponseBody
	public Map<String, String> user(Principal principal) throws Exception{
		Map<String, String> map = new LinkedHashMap<>();
		map.put("name", principal.getName());
		map.put("auth", oauth2ClientContext.getAccessToken().toString());

		System.out.println();
		System.out.println();
		System.out.println("========================================");
		System.out.println(oauth2ClientContext.getAccessToken().toString());
		System.out.println("========================================");
		System.out.println("authenticated!!!!");

        //TODO Check for androidIdToken somehow. Shouldn't be hit on Mobile version
		service = getCalendarService(""+-1);

		DateTime now = new DateTime(System.currentTimeMillis());
		//now.set(java.util.Calendar.DATE, 1);


		Events events = service.events().list("primary")
			.setMaxResults(50)
			.setTimeMin(now)
			.setSingleEvents(false)
			.execute();

		List<Event> items = events.getItems();
		if (items.size() == 0) {
			System.out.println("No upcoming events found.");
		}
		else {
			System.out.println(Colors.ANSI_PURPLE+"Upcoming events (Me route)"+Colors.ANSI_WHITE);
			for (Event event : items) {
				String str = event.getId();
				System.out.printf("%s (%s)\n", str, event.getSummary());
			}

			//System.out.println(Colors.ANSI_YELLOW+events.toPrettyString());

		}

		//set-up the DB
		DBSetup.remoteDB();

		//check if the Table for that UserName exists
		Table tab = DBSetup.getTable(principal.getName().replaceAll(" ", "_"));
		if(tab == null) { //the Table doesn't Exist!!!
			System.out.println("Creating a table for "+principal.getName()+"\'s events");
			//make the table! :D
			DBSetup.createTable(principal.getName().replaceAll(" ", "_"));
		}

		tab = DBSetup.getUsersTable();
		GetItemSpec spec = new GetItemSpec()
			   .withPrimaryKey("username", principal.getName());
		Item got = tab.getItem(spec);
		if(got == null)
			tab.putItem(new Item().withString("username", principal.getName()).withString("calID","primary"));

		return map;///list.get(1).getColorId();
	}

	//get the Credz for the new User
	public Credential authorize(String androidIdToken) throws Exception {
		final List<String> SCOPES =
        	Arrays.asList(CalendarScopes.CALENDAR);
        	TokenResponse tolkien = new TokenResponse();
       if(androidIdToken.compareTo(""+-1) == 0) {
       
    		tolkien.setAccessToken(oauth2ClientContext.getAccessToken().toString());
    		Credential credz = new Credential(BearerToken.authorizationHeaderAccessMethod())
    			.setFromTokenResponse(tolkien);
    		System.out.println("authorized!!!");
    		return credz;
       }
       else {
           // final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
           // HttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
           //  GoogleClientSecrets clientSecrets =
           //     GoogleClientSecrets.load(
           //      JacksonFactory.getDefaultInstance(), new FileReader("client_secrets.json"));
           //  GoogleTokenResponse tokenResponse =
           //      new GoogleAuthorizationCodeTokenRequest(
           //        HTTP_TRANSPORT,
           //        JSON_FACTORY,
           //        "https://www.googleapis.com/oauth2/v4/token",
           //        clientSecrets.getDetails().getClientId(),
           //        clientSecrets.getDetails().getClientSecret(),
           //        androidIdToken,
           //        "http://localhost:8080/login/google")  // Specify the same redirect URI that you use with your web
           //                       // app. If you don't have a web version of your app, you can
           //                       // specify an empty string.
           //        .execute();
           //
           //    TokenResponse tolkien = new TokenResponse();
              tolkien.setAccessToken(access);

              Credential credz = new Credential(BearerToken.authorizationHeaderAccessMethod())
                  .setFromTokenResponse(tolkien);
                  System.out.println("creds...maybe?" + credz.getAccessToken());
            return credz;
        }

	}

	//get and instance of Google Calendar API services
	public com.google.api.services.calendar.Calendar getCalendarService(String androidIdToken) throws Exception {
		final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
		HttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
		Credential credz = authorize(androidIdToken);
		System.out.println("Creds..." + credz.getAccessToken());
		return new com.google.api.services.calendar.Calendar.Builder(
			HTTP_TRANSPORT, JSON_FACTORY, credz)
			.setApplicationName("Epstein")
			.build();
	}
	//get events from @calID Calendar
	public List<Event> getEventsMultiCal(String calID, DateTime start, DateTime end, boolean tableExists, String user, String androidIdToken) throws Exception {
		System.out.println("android id token: "  + androidIdToken);
        if(service == null) {
            service = getCalendarService(androidIdToken);
        }


        System.out.println("arf " + service.toString());
		Events events = service.events().list(calID) // Get events from calendar calID...
			.setTimeMin(start) // Starting at the beginning of the month
			.setTimeMax(end) // and ending at the last day of the month
			.setMaxResults(100)
			.setSingleEvents(true)
			.setOrderBy("startTime")
			.execute();
		//get the data from the HttpServletRequest
		List<Event> items = events.getItems();
		Table table = DBSetup.getTable(user.replaceAll(" ","_"));
		if (items.size() == 0) {
			System.out.println("No upcoming events found.");
			return null;
		}
		else
		{
			//make a list of GenericJson
			List<Event> target = new LinkedList<>();
			System.out.println("Upcoming events for "+calID);
			for (Event event : items) {
				//get the stresslvl from the DB if possible
				String eventID = event.getId();
				Integer val = null;
				if(tableExists) {
					GetItemSpec spec;
					if(eventID.indexOf("_") != -1)
					{
						eventID = eventID.substring(0, eventID.indexOf("_"));
						System.out.println(Colors.ANSI_RED+"="+eventID+"= "+event.getSummary());//+Colors.ANSI_RED+"=nos9g4bakgg4lsgs6tkscuhsjc=");
					}
					spec = new GetItemSpec()
						.withPrimaryKey("eventID", eventID);
					//the event is in the DB!
					Item it = null;
					try {
						it = table.getItem(spec);
					} catch (ResourceNotFoundException e) {
						//System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 2"+e.getMessage());
						//maybe if we make the table?
						//DBSetup.createTable(user.replaceAll(" ", "_"));
						//return null;
					}
					if(it != null)
					System.out.println(Colors.ANSI_CYAN+eventID+ "  "+it.getJSON("stressValue"));
					//get the stresslvl

					if(it != null){
						try{
							val = it.getInt("stressValue");
						} catch (Exception e) {
							val = null;
						}
					}
				}
				else
					val = null;

				//add to the Event class and add to list
				GenericJson new1 = (GenericJson)event.set("stressValue",val);
				target.add((Event)new1);
			}

			//set the 'items' to the new List
			events = events.setItems(target);

			return target;

		}

	}
	//Get events for SPECIFIC CALENDARID
	@RequestMapping(value = "/api/calendar/events/calId")
	@ResponseBody
	public ResponseEntity<String> gettingEventsSpecfic(@RequestBody GenericJson request) throws Exception {

		final HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
		String token = (String)request.get("idToken");
		service = getCalendarService(""+-1);

		System.out.println(Colors.ANSI_BLUE+"JSON "+request.toPrettyString());
		//get the Username and eventID
		String userName = (String)request.get("userName");
		String callID = (String)request.get("calID");
		System.out.println(Colors.ANSI_BLUE+"userName "+userName);
		//String eventID = (String)request.get("eventID");

		//get the Table
		boolean exists = tableCheck(userName);

		//Set up Calendar request
		java.util.Calendar currentDate = java.util.Calendar.getInstance();
		currentDate.set(java.util.Calendar.DATE, 1);
		// The first day of the month
		DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
		System.out.println(beginningOfMonth.toString());
		// The last day of the month
		currentDate.roll(java.util.Calendar.MONTH, 1);
		DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

		//get the User Table and user's data from there
		Table t = DBSetup.getUsersTable();
		GetItemSpec spec = new GetItemSpec()
			   .withPrimaryKey("userID", userName);
		Item got = t.getItem(spec);


		//get a list of Calendar IDs
		String str = got.getString("calID");
		System.out.println(Colors.ANSI_CYAN+"The User Has: "+str);
		String[] calIDs = str.split("split");


		Events events = service.events().list(callID) // Get events from primary calendar...
			.setTimeMin(beginningOfMonth) // Starting at the beginning of the month
			.setTimeMax(endOfMonth) // and ending at the last day of the month
			.setMaxResults(100)
			.setSingleEvents(true)
			.setOrderBy("startTime")
			.execute();

		//get the data from the HttpServletRequest
		List<Event> items = events.getItems();
		if (items.size() == 0) {
			System.out.println("No upcoming events found.");
 			return new ResponseEntity<String>("{\"error\":\"404 Resource Not Found\"}", httpHeaders, HttpStatus.OK);
		}
		else
		{
			//make a list of GenericJson
			List<Event> target = new LinkedList<>();
			Table table = DBSetup.getTable(userName);

			System.out.println("Upcoming events");
			for (Event event : items) {
				//get the stresslvl from the DB if possible
				String eventID = event.getId();
				Integer val = null;
				if(exists) {
					if(eventID.indexOf("_") != -1)
					{
						eventID = eventID.substring(0, eventID.indexOf("_"));
						System.out.println(Colors.ANSI_RED+"="+eventID+"= "+event.getSummary());//+Colors.ANSI_RED+"=nos9g4bakgg4lsgs6tkscuhsjc=");
					}
					spec = new GetItemSpec()
						.withPrimaryKey("eventID", eventID);
					//the event is in the DB!
					Item it = null;
					try {
						it = table.getItem(spec);
					} catch (ResourceNotFoundException e) {

						//System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 3"+e.getMessage());
						//maybe if we make the table?
						//DBSetup.createTable(userName.replaceAll(" ", "_"));
						//return null;
					}
					if(it != null)
						System.out.println(Colors.ANSI_CYAN+eventID+ "  "+it.getJSON("stressValue"));
					//get the stresslvl

					if(it != null){
						try{
							val = it.getInt("stressValue");
						} catch (Exception e) {
							val = null;
						}
					}
				}
				else
					val = null;

				//add to the Event class and add to list
				GenericJson new1 = (GenericJson)event.set("stressValue",val);
				target.add((Event)new1);
				//System.out.printf("%s: ==> (%s)\n", new1.toPrettyString(), eventID);
			}

			//set the 'items' to the new List
			events = events.setItems(target);

			return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
		}



	}

	//Get events for SPECIFIC CALENDARID for android
	@RequestMapping(value = "/api/calendar/androidevents/calId")
	@ResponseBody
	public ResponseEntity<String> gettingAndroidEventsSpecfic(
        @RequestHeader(value="email") String email,
        @RequestHeader(value="idToken") String idToken,
        @RequestHeader(value="calId") String calId) throws Exception {

		final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
		HttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
		final HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);

		GoogleCredential credential = new GoogleCredential().setAccessToken(access);
		service =
            new com.google.api.services.calendar.Calendar.Builder(
					HTTP_TRANSPORT, JSON_FACTORY, credential)
					.setApplicationName("Epstein")
					.build();

		//System.out.println(Colors.ANSI_BLUE+"JSON "+request.toPrettyString());
		//get the Username and eventID
		String userName = email;
		String callID = calId;
		System.out.println(Colors.ANSI_BLUE+"userName "+userName);
		//String eventID = (String)request.get("eventID");

		//get the Table
		boolean exists = tableCheck(userName);

		//Set up Calendar request
		java.util.Calendar currentDate = java.util.Calendar.getInstance();
		currentDate.set(java.util.Calendar.DATE, 1);
		// The first day of the month
		DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
		System.out.println(beginningOfMonth.toString());
		// The last day of the month
		currentDate.roll(java.util.Calendar.MONTH, 1);
		DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

		//get the User Table and user's data from there
		Table t = DBSetup.getUsersTable();
		GetItemSpec spec = new GetItemSpec()
			   .withPrimaryKey("username", userName);
		Item got = t.getItem(spec);


		//get a list of Calendar IDs
		String str = got.getString("calID");
		System.out.println(Colors.ANSI_CYAN+"The User Has: "+str);
		String[] calIDs = str.split("split");


		Events events = service.events().list(callID) // Get events from primary calendar...
			.setTimeMin(beginningOfMonth) // Starting at the beginning of the month
			.setTimeMax(endOfMonth) // and ending at the last day of the month
			.setMaxResults(100)
			.setSingleEvents(true)
			.setOrderBy("startTime")
			.execute();

		//get the data from the HttpServletRequest
		List<Event> items = events.getItems();
		if (items.size() == 0) {
			System.out.println("No upcoming events found.");
 			return new ResponseEntity<String>("{\"error\":\"404 Resource Not Found\"}", httpHeaders, HttpStatus.OK);
		}
		else
		{
			//make a list of GenericJson
			List<Event> target = new LinkedList<>();
			Table table = DBSetup.getTable(userName);

			System.out.println("Upcoming events");
			for (Event event : items) {
				//get the stresslvl from the DB if possible
				String eventID = event.getId();
				Integer val = null;
				if(exists) {
					if(eventID.indexOf("_") != -1)
					{
						eventID = eventID.substring(0, eventID.indexOf("_"));
						System.out.println(Colors.ANSI_RED+"="+eventID+"= "+event.getSummary());//+Colors.ANSI_RED+"=nos9g4bakgg4lsgs6tkscuhsjc=");
					}
					spec = new GetItemSpec()
						.withPrimaryKey("eventID", eventID);
					//the event is in the DB!
					Item it = null;
					try {
						it = table.getItem(spec);
					} catch (ResourceNotFoundException e) {

						//System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 3"+e.getMessage());
						//maybe if we make the table?
						//DBSetup.createTable(userName.replaceAll(" ", "_"));
						//return null;
					}
					if(it != null)
						System.out.println(Colors.ANSI_CYAN+eventID+ "  "+it.getJSON("stressValue"));
					//get the stresslvl

					if(it != null){
						try{
							val = it.getInt("stressValue");
						} catch (Exception e) {
							val = null;
						}
					}
				}
				else
					val = null;

				//add to the Event class and add to list
				GenericJson new1 = (GenericJson)event.set("stressValue",val);
				target.add((Event)new1);
				//System.out.printf("%s: ==> (%s)\n", new1.toPrettyString(), eventID);
			}

			//set the 'items' to the new List
			events = events.setItems(target);

			return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
		}



	}
	//Get events for ALL OF THE USERS CALENDARIDs
	// @RequestMapping(value = "/api/calendar/androidevents")
	// @ResponseBody
	// public ResponseEntity<String> gettingAndroidEvents(String idToken, String email) throws Exception {

	// 	final HttpHeaders httpHeaders = new HttpHeaders();
	// 	httpHeaders.setContentType(MediaType.APPLICATION_JSON);

	// 	if(!validateAndroidToken(idToken, email)) {
	// 		return new ResponseEntity<String>("Invalid ID token", httpHeaders, HttpStatus.FORBIDDEN);
	// 	}

	// 	service = getAndroidCal(idToken);

	// 	//System.out.println(Colors.ANSI_BLUE+"JSON "+request.toPrettyString());
	// 	//get the Username and eventID
	// 	String userName = dbCreds.get(idToken);

	// Gets which type of calendar to import...google or outlook
	@RequestMapping(value = "/calendar/import")
	@ResponseBody
	public ResponseEntity<String> calendarImport(@RequestBody GenericJson request) throws Exception {
		final HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);
		return new ResponseEntity<String>("meow", httpHeaders, HttpStatus.OK);

	}

	// 	System.out.println(Colors.ANSI_BLUE+"username "+userName);
	// 	//String eventID = (String)request.get("eventID");

	// 	//get the Table
	// 	boolean exists = tableCheck(userName);

	// 	//Set up Calendar request
	// 	java.util.Calendar currentDate = java.util.Calendar.getInstance();
	// 	currentDate.set(java.util.Calendar.DATE, 1);
	// 	// The first day of the month
	// 	DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
	// 	System.out.println(beginningOfMonth.toString());
	// 	// The last day of the month
	// 	currentDate.roll(java.util.Calendar.MONTH, 1);
	// 	DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

	// 	//get the User Table and user's data from there
	// 	Table t = DBSetup.getUsersTable();
	// 	GetItemSpec spec = new GetItemSpec()
 //               .withPrimaryKey("username", userName);

 //        Item got = t.getItem(spec);


 //        //get a list of Calendar IDs
 //        String str = got.getString("calID");
 //        System.out.println(Colors.ANSI_CYAN + "The User Has: " + str);
 //        String[] calIDs = str.split("split");


 //        Events events = service.events().list(callID) // Get events from primary calendar...
 //                .setTimeMin(beginningOfMonth) // Starting at the beginning of the month
 //                .setTimeMax(endOfMonth) // and ending at the last day of the month
 //                .setMaxResults(100)
 //                .setSingleEvents(true)
 //                .setOrderBy("startTime")
 //                .execute();

 //        //get the data from the HttpServletRequest
 //        List<Event> items = events.getItems();
 //        if (items.size() == 0) {
 //            System.out.println("No upcoming events found.");
 //            return new ResponseEntity<String>("{\"error\":\"404 Resource Not Found\"}", httpHeaders, HttpStatus.OK);
 //        } else {
 //            //make a list of GenericJson
 //            List<Event> target = new LinkedList<>();
 //            Table table = DBSetup.getTable(userName);

 //            System.out.println("Upcoming events");
 //            for (Event event : items) {
 //                //get the stresslvl from the DB if possible
 //                String eventID = event.getId();
 //                Integer val = null;
 //                if (exists) {
 //                    if (eventID.indexOf("_") != -1) {
 //                        eventID = eventID.substring(0, eventID.indexOf("_"));
 //                        System.out.println(Colors.ANSI_RED + "=" + eventID + "= " + event.getSummary());//+Colors.ANSI_RED+"=nos9g4bakgg4lsgs6tkscuhsjc=");
 //                    }
 //                    spec = new GetItemSpec()
 //                            .withPrimaryKey("eventID", eventID);
 //                    //the event is in the DB!
 //                    Item it = null;
 //                    try {
 //                        it = table.getItem(spec);
 //                    } catch (ResourceNotFoundException e) {

 //                        //System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 3"+e.getMessage());
 //                        //maybe if we make the table?
 //                        //DBSetup.createTable(userName.replaceAll(" ", "_"));
 //                        //return null;
 //                    }
 //                    if (it != null)
 //                        System.out.println(Colors.ANSI_CYAN + eventID + "  " + it.getJSON("stressValue"));
 //                    //get the stresslvl

 //                    if (it != null) {
 //                        try {
 //                            val = it.getInt("stressValue");
 //                        } catch (Exception e) {
 //                            val = null;
 //                        }
 //                    }
 //                } else
 //                    val = null;

 //                //add to the Event class and add to list
 //                GenericJson new1 = (GenericJson) event.set("stressValue", val);
 //                target.add((Event) new1);
 //                //System.out.printf("%s: ==> (%s)\n", new1.toPrettyString(), eventID);
 //            }

 //            //set the 'items' to the new List
 //            events = events.setItems(target);

 //            return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
 //        }


 //    }

    //Get events for ALL OF THE USERS CALENDARIDs
    @RequestMapping(value = "/api/calendar/androidevents")
    @ResponseBody
    public ResponseEntity<String> gettingAndroidEvents(
    @RequestHeader(value="idToken") String idToken,
    @RequestHeader(value="email") String email) throws Exception {

        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // if (!validateAndroidToken(idToken, email)) {
        //     return new ResponseEntity<String>("Invalid ID token", httpHeaders, HttpStatus.FORBIDDEN);
        // }

        //service = getAndroidCal(idToken);

        //System.out.println(Colors.ANSI_BLUE+"JSON "+request.toPrettyString());
        //get the Username and eventID
        String userName = email.replace("@", "");
        System.out.println(Colors.ANSI_BLUE + "username " + userName);
        System.out.println(Colors.ANSI_BLUE + "username " + userName.replace("@", ""));
        //String eventID = (String)request.get("eventID");
        DBSetup.remoteDB();
        //get the Table
        boolean exists = tableCheck(userName.replace("@", ""));
        System.out.println(Colors.ANSI_BLUE + "Table is " +exists);
        //Set up Calendar request
        java.util.Calendar currentDate = java.util.Calendar.getInstance();
        currentDate.set(java.util.Calendar.DATE, 1);
        // The first day of the month
        DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
        System.out.println(beginningOfMonth.toString());
        // The last day of the month
        currentDate.roll(java.util.Calendar.MONTH, 1);
        DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

        //get the User Table and user's data from there
        Table t = DBSetup.getUsersTable();
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey("username", userName);
        Item got = t.getItem(spec);

        //get a list of Calendar IDs
        String str = got.getString("calID");
        System.out.println(Colors.ANSI_CYAN + "The User Has: " + got.toString());
        String[] calIDs = str.split("split");

        List<Event> target = new LinkedList<>();
        Table table = DBSetup.getTable(userName);
        for (String val : calIDs) {
            System.out.println(Colors.ANSI_CYAN + "The calid now is: " + val);
            //get the events for each of these
            List<Event> addThis = getEventsMultiCal(val, beginningOfMonth, endOfMonth, true, userName, idToken);
            //add it to a list of all the events retrieved
            if (addThis != null)
                target.addAll(addThis);
        }
        Events events = service.events().list("primary") // Get events from primary calendar...
                .setMaxResults(1)
                .setSingleEvents(true)
                .setOrderBy("startTime")
                .execute();
        events.setItems(target);

        return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);


    }

    //Get events for ALL OF THE USERS CALENDARIDs
    @RequestMapping(value = "/api/calendar/events")
    @ResponseBody
    public ResponseEntity<String> gettingEvents(@RequestBody GenericJson request) throws Exception {

        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        //TODO Check for androidIdToken in JSON
        service = getCalendarService(""+-1);

        System.out.println(Colors.ANSI_BLUE + "JSON " + request.toPrettyString());
        //get the Username and eventID
        String userName = (String) request.get("userName");

        System.out.println(Colors.ANSI_BLUE + "userName " + userName);
        //String eventID = (String)request.get("eventID");

        //get the Table
        boolean exists = tableCheck(userName);

        //Set up Calendar request
        java.util.Calendar currentDate = java.util.Calendar.getInstance();
        currentDate.set(java.util.Calendar.DATE, 1);
        // The first day of the month
        DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
        System.out.println(beginningOfMonth.toString());
        // The last day of the month
        currentDate.roll(java.util.Calendar.MONTH, 1);
        DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

        //get the User Table and user's data from there
        Table t = DBSetup.getUsersTable();
        GetItemSpec spec = new GetItemSpec()
                .withPrimaryKey("username", userName);
        Item got = t.getItem(spec);


        //get a list of Calendar IDs
        String str = got.getString("calID");
        System.out.println(Colors.ANSI_CYAN + "The User Has: " + str);
        String[] calIDs = str.split("split");

        List<Event> target = new LinkedList<>();
        Table table = DBSetup.getTable(userName);
        for (String val : calIDs) {
            System.out.println(Colors.ANSI_CYAN + "The calid now is: " + val);
            //get the events for each of these
            List<Event> addThis = getEventsMultiCal(val, beginningOfMonth, endOfMonth, true, userName, ""+-1);
            //add it to a list of all the events retrieved
            if (addThis != null)
                target.addAll(addThis);
        }
        Events events = service.events().list("primary") // Get events from primary calendar...
                .setMaxResults(1)
                .setSingleEvents(true)
                .setOrderBy("startTime")
                .execute();
        events.setItems(target);

        return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);


    }

    ///Logout a user using the Servlet Context
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "index";//You can redirect wherever you want, but generally it's a good practice to show login screen again.
    }

    ///Logout a user using the Servlet Context
    @RequestMapping(value = "/androidlogout", method = RequestMethod.GET)
    public String logoutAndroidPage(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
        return "index";//You can redirect wherever you want, but generally it's a good practice to show login screen again.
    }

    //get a month worth of events from the First day of the month to the first of the next month
    //TODO: Fix the frontend's event cap
    @RequestMapping(value = "/me/calendar/events")
    @ResponseBody
    public ResponseEntity<String> events(@RequestBody GenericJson request) throws Exception {
        //HTTP Headers

        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // Returns all events in the current month
        //TODO Check for androidIdToken in JSON
        service = getCalendarService(""+-1);

        System.out.println(Colors.ANSI_BLUE + "JSON " + request.toPrettyString());
        //get the Username and eventID
        String userName = (String) request.get("userName");

        System.out.println(Colors.ANSI_BLUE + "userName " + userName);
        //String eventID = (String)request.get("eventID");

        //get the Table
        boolean exists = tableCheck(userName);


        //Set up Calendar request
        java.util.Calendar currentDate = java.util.Calendar.getInstance();
        currentDate.set(java.util.Calendar.DATE, 1);
        // The first day of the month
        DateTime beginningOfMonth = new DateTime(currentDate.getTimeInMillis());
        System.out.println(beginningOfMonth.toString());
        // The last day of the month
        currentDate.roll(java.util.Calendar.MONTH, 1);
        DateTime endOfMonth = new DateTime(currentDate.getTimeInMillis());

        Events events = service.events().list("primary") // Get events from primary calendar...
                .setTimeMin(beginningOfMonth) // Starting at the beginning of the month
                .setTimeMax(endOfMonth) // and ending at the last day of the month
                .setMaxResults(150)
                .setSingleEvents(true)
                .setOrderBy("startTime")
                .execute();

        //get the data from the HttpServletRequest
        List<Event> items = events.getItems();
        if (items.size() == 0) {
            System.out.println("No upcoming events found.");
            return new ResponseEntity<String>("{\"error\":\"404 Resource Not Found\"}", httpHeaders, HttpStatus.OK);
        } else {
            //make a list of GenericJson
            List<Event> target = new LinkedList<>();
            Table table = DBSetup.getTable(userName);

            System.out.println("Upcoming events");
            for (Event event : items) {
                //get the stresslvl from the DB if possible
                String eventID = event.getId();
                Integer val = null;
                if (exists) {
                    GetItemSpec spec;
                    if (eventID.indexOf("_") != -1) {
                        eventID = eventID.substring(0, eventID.indexOf("_"));
                        System.out.println(Colors.ANSI_RED + "=" + eventID + "= " + event.getSummary());//+Colors.ANSI_RED+"=nos9g4bakgg4lsgs6tkscuhsjc=");
                    }
                    spec = new GetItemSpec()
                            .withPrimaryKey("eventID", eventID);
                    //the event is in the DB!
                    Item it = null;
                    try {
                        it = table.getItem(spec);
                    } catch (ResourceNotFoundException e) {
                        //System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 4"+e.getMessage());
                        //maybe if we make the table?
                        //DBSetup.createTable(userName.replaceAll(" ", "_"));
                        //return null;
                    }
                    if (it != null)
                        System.out.println(Colors.ANSI_CYAN + eventID + "  " + it.getJSON("stressValue"));
                    //get the stresslvl

                    if (it != null) {
                        try {
                            val = it.getInt("stressValue");
                        } catch (Exception e) {
                            val = null;
                        }
                    }
                } else
                    val = null;

                //add to the Event class and add to list
                GenericJson new1 = (GenericJson) event.set("stressValue", val);
                target.add((Event) new1);
                //System.out.printf("%s: ==> (%s)\n", new1.toPrettyString(), eventID);
            }

            //set the 'items' to the new List
            events = events.setItems(target);

            return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
        }
    }

    // Display the information for a single event in the user's calendar
    @RequestMapping(value = "/event/detail")
    @ResponseBody
    public ResponseEntity<String> eventDetails(@RequestBody GenericJson request) throws Exception {
        db.accessDB();
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        //TODO Check for androidIdToken in JSON
        service = getCalendarService(""+-1);
        String calID = (String) request.get("calID");
        String eventID = (String) request.get("eventID");

        Event event = service.events().get(calID, eventID).execute();
        return new ResponseEntity<String>(event.toPrettyString(), httpHeaders, HttpStatus.OK);

    }

    /*
     * Spring Security Set up
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //temp = http;
        // @formatter:off
        http.antMatcher("/**").authorizeRequests().antMatchers("/", "/login**", "/webjars/**", "/androidlogin", "/androidme", "/calendar/suggest/**", "/calendar/androidsuggest**", "/calendar/androidsuggest**","/calendar/add", "/advice", "/calendar/list", "/calendar/add", "/api/calendar/androidevents").permitAll().anyRequest()
                .authenticated().and().exceptionHandling()
                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/")).and().logout()
                .logoutSuccessUrl("/").permitAll().and().csrf().disable()
                ///disabled the CSRF Tokens
                .addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class);
        // @formatter:on
    }

    @Configuration
    @EnableResourceServer
    protected static class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
        @Override
        public void configure(HttpSecurity http) throws Exception {
            // @formatter:off
            http.antMatcher("/me").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/androidlogin").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/androidme").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/api/calendar/androidevents").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/list").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/advice").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/androidlogout").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/event").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/add").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/suggest/{userName}").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/suggest/wait/{userName}").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/suggest/train/{userName}").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/androidsuggest").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/androidsuggest/wait/{userName}").authorizeRequests().anyRequest().authenticated();
            http.antMatcher("/calendar/androidsuggest/train/{userName}").authorizeRequests().anyRequest().authenticated();
            // @formatter:on
        }
    }

    @Bean
    public FilterRegistrationBean oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        System.out.println("FILTER BEING MADE");
        registration.setFilter(filter);
        registration.setOrder(-100);
        return registration;
    }

    @Bean
    @ConfigurationProperties("google")//Google Login setup
    public ClientResources google() {
        System.out.println("RESOURCE BEING MADE");
        return new ClientResources();
    }

    private Filter ssoFilter() {
        CompositeFilter filter = new CompositeFilter();
        List<Filter> filters = new ArrayList<>();
        System.out.println("FILTER LIST MADE");
        String path = "/login/google";
        filters.add(ssoFilter(google(), path));
        filter.setFilters(filters);
        System.out.println("RESOURCE BEING MADE");
        return filter;
    }

    private Filter ssoFilter(ClientResources client, String path) {
        OAuth2ClientAuthenticationProcessingFilter filter = new OAuth2ClientAuthenticationProcessingFilter(
                path);
        OAuth2RestTemplate template = new OAuth2RestTemplate(client.getClient(), oauth2ClientContext);
        filter.setRestTemplate(template);
        UserInfoTokenServices tokenServices = new UserInfoTokenServices(
                client.getResource().getUserInfoUri(), client.getClient().getClientId());
        tokenServices.setRestTemplate(template);
        filter.setTokenServices(tokenServices);
        return filter;
    }

    //Deploy the Server
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    /*
     ** Helper Methods
     ** to keep the code clean
     */
    public static boolean tableCheck(String userName) {
        boolean exists = true;
        Table table = DBSetup.getTable(userName);
        GetItemSpec spec12 = new GetItemSpec()
                .withPrimaryKey("eventID", "123213213fwqefefw");
        //the event is in the DB!
        Item it1 = null;
        try {
            it1 = table.getItem(spec12);
            return true;
        } catch (ResourceNotFoundException e) {
            //System.out.println(Colors.ANSI_CYAN+"Get Item is messing up: 1"+e.getMessage());
            //maybe if we make the table?
            DBSetup.createTable(userName.replaceAll(" ", "_"));
            return false;
        }
    }
}


class ClientResources {

    @NestedConfigurationProperty
    private AuthorizationCodeResourceDetails client = new AuthorizationCodeResourceDetails();

    @NestedConfigurationProperty
    private ResourceServerProperties resource = new ResourceServerProperties();


    public ClientResources() {
        client.setClientId(System.getenv("GOOGLE_CLIENT_ID"));
        client.setClientSecret(System.getenv("GOOGLE_CLIENT_SECRET"));
        List<String> str = new ArrayList<>();
        str.add(CalendarScopes.CALENDAR);
        client.setScope(str);
    }

    public AuthorizationCodeResourceDetails getClient() {
        return client;
    }

    public ResourceServerProperties getResource() {
        return resource;
    }
}

class ClientResourcesTest {

    @NestedConfigurationProperty
    private AuthorizationCodeResourceDetails client = new AuthorizationCodeResourceDetails();

    @NestedConfigurationProperty
    private ResourceServerProperties resource = new ResourceServerProperties();


    public ClientResourcesTest() {
        client.setClientId(System.getenv("GOOGLE_CLIENT_ID_TEST"));
        client.setClientSecret(System.getenv("GOOGLE_CLIENT_SECRET_TEST"));
        List<String> str = new ArrayList<>();
        str.add(CalendarScopes.CALENDAR);
        client.setScope(str);
    }

    public AuthorizationCodeResourceDetails getClient() {
        return client;
    }

    public ResourceServerProperties getResource() {
        return resource;
    }
}
