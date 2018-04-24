package com.stressmanager.ml;

import java.util.List;

/**
 * Used for formatting week data to the client
 */
public class RawWeekData {
    public RawWeekData(List<List<EventData>> weekdayItems) {
        this.weekdayItems = weekdayItems;
    }
    List<List<EventData>> weekdayItems;
}
