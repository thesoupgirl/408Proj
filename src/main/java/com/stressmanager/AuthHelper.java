package com.stressmanager;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.UUID;
import java.util.Calendar;
import org.springframework.beans.factory.annotation.Value;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

import org.springframework.web.util.UriComponentsBuilder;

public class AuthHelper {
  private static final String authority = "https://login.microsoftonline.com";
  private static final String authorizeUrl = authority + "/common/oauth2/v2.0/authorize";

  private static String[] scopes = { 
    "openid", 
    "offline_access",
    "profile", 
    "User.Read",
    "Mail.Read",
    "Calendars.Read"
  };

  @Value("${outlook.client.appId}")
  private static String appId;

  private static String appPassword = null;
  private static String redirectUrl = null;

  private static String getAppId() {
    System.out.println("nuuuu");
    System.out.println(appId);
    if (appId == null) {
      try {
        loadConfig();
      } catch (Exception e) {
        return null;
      }
    }
    appId="d47db936-04fe-446f-8e69-a0c52e86d8b1";
    return appId;
  }
  private static String getAppPassword() {
    if (appPassword == null) {
      try {
        loadConfig();
      } catch (Exception e) {
        return null;
      }
    }
    return appPassword;
  }

  private static String getRedirectUrl() {
    if (redirectUrl == null) {
      try {
        loadConfig();
      } catch (Exception e) {
        return null;
      }
    }
    return redirectUrl;
  }

  private static String getScopes() {
    StringBuilder sb = new StringBuilder();
    for (String scope: scopes) {
      sb.append(scope + " ");
    }
    return sb.toString().trim();
  }

  private static void loadConfig() throws IOException {
    String authConfigFile = "../../resources/application.yml";
    InputStream authConfigStream = AuthHelper.class.getClassLoader().getResourceAsStream(authConfigFile);

    if (authConfigStream != null) {
      Properties authProps = new Properties();
      try {
        authProps.load(authConfigStream);
        System.out.println("mayyyyyybe");
        System.out.println(appId);
        //appId = authProps.getProperty("appId");
        appId = "d47db936-04fe-446f-8e69-a0c52e86d8b1";
        //appPassword = authProps.getProperty("appPassword");
        appPassword="jMO11819%]cqmchtNOZKF$!";
        //redirectUrl = authProps.getProperty("redirectUrl");
        redirectUrl = "http:localhost:8080/authorize.html";
      } finally {
        authConfigStream.close();
      }
    }
    else {
      throw new FileNotFoundException("Property file '" + authConfigFile + "' not found in the classpath.");
    }
  }

  public static TokenResp ensureTokens(TokenResp tokens, String tenantId) {
  // Are tokens still valid?
  Calendar now = Calendar.getInstance();
  if (now.getTime().before(tokens.getExpirationTime())) {
    // Still valid, return them as-is
    return tokens;
  }
  else {
    // Expired, refresh the tokens
    // Create a logging interceptor to log request and responses
    HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
    interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

    OkHttpClient client = new OkHttpClient.Builder()
        .addInterceptor(interceptor).build();

    // Create and configure the Retrofit object
    Retrofit retrofit = new Retrofit.Builder()
        .baseUrl(authority)
        .client(client)
        .addConverterFactory(JacksonConverterFactory.create())
        .build();

    // Generate the token service
    TokenService tokenService = retrofit.create(TokenService.class);

    try {
      return tokenService.getAccessTokenFromRefreshToken(tenantId, getAppId(), getAppPassword(), 
          "refresh_token", tokens.getRefreshToken(), getRedirectUrl()).execute().body();
    } catch (IOException e) {
      TokenResp error = new TokenResp();
      error.setError("IOException");
      error.setErrorDescription(e.getMessage());
      return error;
    }
  }
}

  public static String getLoginUrl(UUID state, UUID nonce) {

    UriComponentsBuilder urlBuilder = UriComponentsBuilder.fromHttpUrl(authorizeUrl);
    // urlBuilder.queryParam("client_id", getAppId());
    urlBuilder.queryParam("client_id", "d47db936-04fe-446f-8e69-a0c52e86d8b1");
    urlBuilder.queryParam("redirect_uri", "http://localhost:8080/authorize");
    // urlBuilder.queryParam("redirect_uri", getRedirectUrl());
    urlBuilder.queryParam("response_type", "code id_token");
    urlBuilder.queryParam("scope", getScopes());
    urlBuilder.queryParam("state", state);
    urlBuilder.queryParam("nonce", nonce);
    urlBuilder.queryParam("response_mode", "form_post");

    return urlBuilder.toUriString();
  }

  public static TokenResp getTokenFromAuthCode(String authCode, String tenantId) {
  // Create a logging interceptor to log request and responses
  HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
  interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

  OkHttpClient client = new OkHttpClient.Builder()
      .addInterceptor(interceptor).build();

  // Create and configure the Retrofit object
  Retrofit retrofit = new Retrofit.Builder()
      .baseUrl(authority)
      .client(client)
      .addConverterFactory(JacksonConverterFactory.create())
      .build();

  // Generate the token service
  TokenService tokenService = retrofit.create(TokenService.class);

  try {
    System.out.println("getting access token from auth code");
    return tokenService.getAccessTokenFromAuthCode(tenantId, "d47db936-04fe-446f-8e69-a0c52e86d8b1", "JWXK3740(|=+dzfzpzmCEC0", 
        "authorization_code", authCode, "http://localhost:8080/authorize").execute().body();
  } catch (IOException e) {
    System.out.println("In AuthHelper in getTokenFromAuthCode catch...");
    TokenResp error = new TokenResp();
    error.setError("IOException");
    error.setErrorDescription(e.getMessage());
    return error;
  }
}
}