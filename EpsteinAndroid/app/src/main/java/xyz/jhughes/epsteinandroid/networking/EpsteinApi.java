package xyz.jhughes.epsteinandroid.networking;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import xyz.jhughes.epsteinandroid.models.Advice;
import xyz.jhughes.epsteinandroid.models.Calendars.Calendars;
import xyz.jhughes.epsteinandroid.models.Events.Events;
import xyz.jhughes.epsteinandroid.models.Me;

public interface EpsteinApi {
    @FormUrlEncoded
    @POST("androidlogin")
    Call<String> login(@Field("androidIdToken") String androidIdToken);

    @GET("androidme")
    Call<Me> getMe(@Header("email") String email, @Header("idToken") String idToken);

    @GET("androidadvice")
    Call<Advice> getAdvice(@Header("email") String email, @Header("idToken") String idToken);

    @POST("api/calendar/androidevents")
    Call<Events> getEvents(@Header("email") String email, @Header("idToken") String idToken);

    @GET("calendar/androidlist")
    Call<Calendars> getCalendarImportList(@Header("email") String email, @Header("idToken") String idToken);

    @POST("calendar/androidadd")
    Call<Void> importCalendar(@Header("email") String email, @Header("idToken") String idToken, @Header("calId") String calId);

}
