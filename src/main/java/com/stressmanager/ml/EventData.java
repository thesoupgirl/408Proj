package com.stressmanager.ml;

import org.joda.time.DateTime;

public class EventData {
    private String eventId;
    private DateTime eventTime;
    private int stress;



    public EventData() {
        eventId = null;
        eventTime = DateTime.now();
        stress = 0;
    }

    public EventData(String eventId, DateTime eventTime, int stress) {
        this.eventId = eventId;
        this.eventTime = eventTime;
        this.stress = stress;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public DateTime getEventTime() {
        return eventTime;
    }
    public int getStress() {
        return stress;
    }
    public void setEventTime(DateTime eventTime) {
        this.eventTime = eventTime;
    }

    @Override
    public String toString() {
        return "EventData: id = " + eventId + ", eventTime = " + eventTime + ", stress: " + stress;
    }
    @Override
    public boolean equals(Object o) {
        EventData toCompare = (EventData)o;
        return toCompare.stress == this.stress &&
                toCompare.eventTime.getMillis() == this.eventTime.getMillis() &&
                toCompare.eventId.equals(this.eventId);
    }
}
