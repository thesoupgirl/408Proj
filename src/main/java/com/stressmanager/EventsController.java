package com.stressmanager;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@RestController
public class EventsController {

  @RequestMapping("/outlook/events")
  public ResponseEntity<PagedResult<Eventy>> events(Model model, HttpServletRequest request, RedirectAttributes redirectAttributes) {
    HttpSession session = request.getSession();
    final HttpHeaders httpHeaders = new HttpHeaders();
    TokenResp tokens = (TokenResp)session.getAttribute("tokens");
    if (tokens == null) {
      // No tokens in session, user needs to sign in
      redirectAttributes.addFlashAttribute("error", "Please sign in to continue.");
      System.out.println("You fucked up..." + tokens);
      return new ResponseEntity<PagedResult<Eventy>>(null, httpHeaders, HttpStatus.BAD_REQUEST);
    }

    String tenantId = (String)session.getAttribute("userTenantId");

    tokens = AuthHelper.ensureTokens(tokens, tenantId);

    String email = (String)session.getAttribute("userEmail");

    OutlookService outlookService = OutlookServiceBuilder.getOutlookService(tokens.getAccessToken(), email);

    // Sort by start time in descending order
    String sort = "start/dateTime DESC";
    // Only return the properties we care about
    String properties = "organizer,subject,start,end";
    // Return at most 10 events
    Integer maxResults = 10;

    String eventsStr = "";

    try {
      PagedResult<Eventy> events = outlookService.getEvents(
          sort, properties, maxResults)
          .execute().body();

      System.out.println(events.getValue());
      return new ResponseEntity<PagedResult<Eventy>>(events, httpHeaders, HttpStatus.OK);

    } catch (IOException e) {
      redirectAttributes.addFlashAttribute("error", e.getMessage());
      System.out.println(e.getMessage());
      return new ResponseEntity<PagedResult<Eventy>>(null, httpHeaders, HttpStatus.BAD_REQUEST);
    }

    //return new ResponseEntity<PagedResult<Eventy>>(null, httpHeaders, HttpStatus.BAD_REQUEST);
  }
}