package xyz.jhughes.epsteinandroid.models.Calendars;

public class CalendarToImport {
    public String calId;
    public String userName;
    public String idToken;

    public CalendarToImport(String calId, String userName, String idToken) {
        this.calId = calId;
        this.userName = userName;
        this.idToken = idToken;
    }
}
