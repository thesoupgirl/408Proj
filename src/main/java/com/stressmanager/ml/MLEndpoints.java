package com.stressmanager.ml;

import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.document.spec.GetItemSpec;
import com.amazonaws.services.dynamodbv2.model.ResourceNotFoundException;
import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.GenericJson;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonString;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import com.stressmanager.BackendApplication;
import com.stressmanager.Colors;
import com.stressmanager.DBSetup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@EnableOAuth2Client
public class MLEndpoints {

    @Autowired
    public OAuth2ClientContext oauth2ClientContext;
    String access = "";

    static com.google.api.services.calendar.Calendar service;

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/suggest/{userName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getCalendarSuggestion(@PathVariable(value = "userName") String userName) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserEvents(userName);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        // TODO reschedule every single event in the current week
        for (int i = 1; i <= 7; i++) {
            if (currentWeek.getEvents(i) == null) continue;
            for (EventData event : currentWeek.getEvents(i)) {
                try {
                    returnedWeek = ReschedulingMachineLearningManager.getInstance().predictRescheduling(event.getEventId(), returnedWeek);
                } catch (RuntimeException e) {
                    // If any exceptions, continue and do not change the returned week week
                    continue;
                    //response = "{\"Error\":\"" + e + "\"}";
                    //return new ResponseEntity<>(response, httpHeaders, HttpStatus.BAD_REQUEST);
                }
            }
        }
        for (int i = 1; i <= 7; i++) {
            if (currentWeek.getEvents(i) == null) continue;
            for (EventData event :currentWeek.getEvents(i)) {
                // Search for each event that may have been rescheduled, and replace the time
                EventDateTime newTime = events.getItems().stream().filter(item -> item.getId().equals(event.getEventId())).collect(Collectors.toList()).get(0).getOriginalStartTime();
                newTime.setDateTime(new DateTime(event.getEventTime().getMillis()));
            }
        }
        //response = gson.toJson(returnedWeek.getRaw());
        //return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);


        return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
    }

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/suggest/wait/{userName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getTimeReschedSuggestion(@PathVariable(value = "userName") String userName) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserEvents(userName);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        double result = WhenReschedulingMachineLearningManager.getInstance().predictReschedulingNotification(returnedWeek);

        return new ResponseEntity<>("{\"waitTime\":" + result + "}", httpHeaders, HttpStatus.OK);
    }

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/suggest/train/{userName}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> trainReschedSuggestion(@PathVariable(value = "userName") String userName, @RequestBody GenericJson request) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        double timeTaken = (double) request.get("timeTaken");

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserEvents(userName);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        WhenReschedulingMachineLearningManager.getInstance().trainReschedulingNotification(timeTaken, returnedWeek);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/androidsuggest", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getAndroidCalendarSuggestion(@RequestHeader(value="idToken") String idToken,
                                                               @RequestHeader(value="email") String email) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserAndroidEvents(email, idToken);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        // TODO reschedule every single event in the current week
        for (int i = 1; i <= 7; i++) {
            if (currentWeek.getEvents(i) == null) continue;
            for (EventData event : currentWeek.getEvents(i)) {
                try {
                    returnedWeek = ReschedulingMachineLearningManager.getInstance().predictRescheduling(event.getEventId(), returnedWeek);
                } catch (RuntimeException e) {
                    // If any exceptions, continue and do not change the returned week week
                    continue;
                    //response = "{\"Error\":\"" + e + "\"}";
                    //return new ResponseEntity<>(response, httpHeaders, HttpStatus.BAD_REQUEST);
                }
            }
        }
        for (int i = 1; i <= 7; i++) {
            if (currentWeek.getEvents(i) == null) continue;
            for (EventData event :currentWeek.getEvents(i)) {
                // Search for each event that may have been rescheduled, and replace the time
                EventDateTime newTime = events.getItems().stream().filter(item -> item.getId().equals(event.getEventId())).collect(Collectors.toList()).get(0).getOriginalStartTime();
                newTime.setDateTime(new DateTime(event.getEventTime().getMillis()));
            }
        }
        //response = gson.toJson(returnedWeek.getRaw());
        //return new ResponseEntity<>(response, httpHeaders, HttpStatus.OK);


        return new ResponseEntity<String>(events.toPrettyString(), httpHeaders, HttpStatus.OK);
    }

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/androidsuggest/wait/{userName}", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<String> getAndroidTimeReschedSuggestion(@RequestHeader(value="idToken") String idToken,
                                                                  @RequestHeader(value="email") String email) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserAndroidEvents(email, idToken);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        double result = WhenReschedulingMachineLearningManager.getInstance().predictReschedulingNotification(returnedWeek);

        return new ResponseEntity<>("{\"waitTime\":" + result + "}", httpHeaders, HttpStatus.OK);
    }

    // Route that gets a rescheduled day suggestion using machine learning
    @RequestMapping(value = "/calendar/androidsuggest/train/{userName}", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> trainAndroidReschedSuggestion(@RequestHeader(value="idToken") String idToken,
                                                                @RequestHeader(value="email") String email, @RequestBody GenericJson request) throws Exception {
        final HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        double timeTaken = (double) request.get("timeTaken");

        // GET THE CURRENT WEEK OF THE CALENDAR
        Events events = getUserAndroidEvents(email, idToken);

        WeekData currentWeek = new WeekData();
        for (Event event : events.getItems()) {
            if (event.getOriginalStartTime() == null || event.getOriginalStartTime().getDateTime() == null || event.getColorId() == null) continue;
            System.out.println("Id: " + event.getId() + " Time: " + event.getOriginalStartTime().getDateTime() + " Color: " + event.getColorId() + " weekdata: " + currentWeek);
            currentWeek.addEvent(new EventData(event.getId(),  new org.joda.time.DateTime(event.getOriginalStartTime().getDateTime().getValue()), Integer.parseInt(event.getColorId())));
        }

        WeekData returnedWeek = new WeekData(currentWeek);


        WhenReschedulingMachineLearningManager.getInstance().trainReschedulingNotification(timeTaken, returnedWeek);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    private Events getUserAndroidEvents(String email, String idToken) throws  Exception {
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
        return events;
    }


    private Events getUserEvents(String userName) throws Exception{


        Calendar service = getCalendarService(""+-1);

        //System.out.println(Colors.ANSI_BLUE + "JSON " + request.toPrettyString());
        //get the Username and eventID
        //String userName = (String) request.get("userName");

        System.out.println(Colors.ANSI_BLUE + "userName " + userName);
        //String eventID = (String)request.get("eventID");

        //get the Table
        boolean exists = BackendApplication.tableCheck(userName);

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
        return events;
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
