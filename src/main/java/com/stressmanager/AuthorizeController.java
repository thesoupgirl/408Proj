package com.stressmanager;

import java.util.UUID;

import javax.servlet.http.*;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

//@Controller
@RestController
public class AuthorizeController {
  @RequestMapping("/outlook/logout")
  public String logout(HttpServletRequest request) {
    HttpSession session = request.getSession();
    session.invalidate();
    return "redirect:/index.html";
  }

  @RequestMapping(value="/authorize", method=RequestMethod.POST)
  public void authorize(
      @RequestParam("code") String code, 
      @RequestParam("id_token") String idToken,
      @RequestParam("state") UUID state,
      HttpServletRequest request, HttpServletResponse response) { {
    // Get the expected state value from the session
    System.out.println("arrrrrf");
    HttpSession session = request.getSession();
    UUID expectedState = (UUID) session.getAttribute("expected_state");
    UUID expectedNonce = (UUID) session.getAttribute("expected_nonce");

    // Make sure that the state query parameter returned matches
    // the expected state
    if (state.equals(expectedState)) {
      IdToken idTokenObj = IdToken.parseEncodedToken(idToken, expectedNonce.toString());
      if (idTokenObj != null) {
        TokenResp tokenResponse = AuthHelper.getTokenFromAuthCode(code, idTokenObj.getTenantId());
        session.setAttribute("tokens", tokenResponse);
        session.setAttribute("userConnected", true);
        session.setAttribute("userName", idTokenObj.getName());
        session.setAttribute("userTenantId", idTokenObj.getTenantId());
      } else {
        //return "Id token failed validation";
        //session.setAttribute("error", "ID token failed validation.");
      }
    }
    else {
      //return "Unexpected state";
      //session.setAttribute("error", "Unexpected state returned from authority.");
    }
    try {
      response.sendRedirect("/");
    }
    catch(Exception e) {
      
    }
  }
}
}