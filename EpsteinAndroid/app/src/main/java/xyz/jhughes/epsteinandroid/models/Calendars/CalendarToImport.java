package xyz.jhughes.epsteinandroid.models.Calendars;

public class CalendarToImport {
    public String calID;
    public String userName;
    public String idToken;

    public CalendarToImport(String calID, String userName, String idToken) {
        this.calID = calID;
        this.userName = userName;
        this.idToken = idToken;
    }
}
