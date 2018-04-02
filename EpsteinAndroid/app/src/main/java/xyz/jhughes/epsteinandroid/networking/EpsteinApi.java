package xyz.jhughes.epsteinandroid.networking;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import xyz.jhughes.epsteinandroid.models.Advice;
import xyz.jhughes.epsteinandroid.models.Calendars.CalendarToImport;
import xyz.jhughes.epsteinandroid.models.Calendars.Calendars;
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.models.Events.RateEvent;
import xyz.jhughes.epsteinandroid.models.MLTime;

public interface EpsteinApi {
    @POST("androidlogin")
    Call<String> login(@Header("androidIdToken") String androidIdToken);

    @GET("advice")
    Call<Advice> getAdvice(@Header("email") String email, @Header("idToken") String idToken);

    @POST("api/calendar/androidevents")
    Call<Events> getEvents(@Header("email") String email, @Header("idToken") String idToken);

    @GET("calendar/list")
    Call<Calendars> getCalendarImportList(@Header("email") String email, @Header("idToken") String idToken);

    @POST("calendar/add")
    Call<Void> importCalendar(@Body CalendarToImport toImport);

    @POST("calendar/event")
    Call<Void> updateStreeEvent(@Body RateEvent model);

    @GET("outlooksignin")
    Call<String> getOutlookUrl();

    @GET("calendar/androidsuggest")
    Call<Events> getEventsToRescheduleSuggestions(@Header("email") String email, @Header("idToken") String idToken);
}
