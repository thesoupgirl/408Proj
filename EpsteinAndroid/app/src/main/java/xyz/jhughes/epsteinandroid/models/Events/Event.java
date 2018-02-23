package xyz.jhughes.epsteinandroid.models.Events;

public class Event {
    public String summary;
    public String created;
    public String status;
    public String id;
    public String recurringEventId;

    public CalendarUser creator;
    public CalendarUser organizer;

    public Time originalStartTime;
    public Time start;
    public Time end;

    public int stressValue;
}
