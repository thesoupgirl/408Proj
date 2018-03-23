package com.stressmanager.ml;

public class MLSuggestionRequest {
    public RawWeekData currentWeek;
    public String focusedEventId;

    public String focusedEventId() {
        return focusedEventId;
    }

    public void focusedEventId(String focusedEvent) {
        this.focusedEventId = focusedEvent;
    }


    public RawWeekData getCurrentWeek() {
        return currentWeek;
    }

    public void setCurrentWeek(RawWeekData currentWeek) {
        this.currentWeek = currentWeek;
    }

}
