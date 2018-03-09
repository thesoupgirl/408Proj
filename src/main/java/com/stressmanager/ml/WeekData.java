package com.stressmanager.ml;

import java.util.*;

public class WeekData {
    // Integer as in the day of the week
    private HashMap<Integer, HashMap<String, EventData>> dataMap;

    public WeekData() {
        dataMap = new HashMap<>();
    }

    public WeekData(List<EventData> toAdd) {
        this();
        for (EventData event : toAdd) {
            addEvent(event);
        }
    }

    public void addEvent(EventData toAdd) {
        int day = toAdd.getEventTime().getDayOfWeek();
        if (dataMap.containsKey(day)) {
            dataMap.get(day).put(toAdd.getEventId(), toAdd);
        } else {
            HashMap<String, EventData> newMap = new HashMap<>();
            newMap.put(toAdd.getEventId(), toAdd);
            dataMap.put(day, newMap);
        }
    }

    /**
     * Sets and replaces an event in the event data.
     * If the event data does not exist, it will be added.
     * @param toSet
     */
    public void setEvent(EventData toSet) {
        if (dataMap.values().stream().anyMatch(item -> item.values().stream().anyMatch(innerItem -> innerItem.getEventId().equals(toSet.getEventId())))) {
            dataMap.get(toSet.getEventTime().getDayOfWeek()).put(toSet.getEventId(), toSet);
        } else {
            addEvent(toSet);
        }
    }

    /**
     * Get an event from the event id
     * @param id
     * @return
     */
    public EventData getEvent(String id) {
        for (HashMap<String, EventData> eventList : dataMap.values()) {
            for (EventData data : eventList.values()) {
                if (data.getEventId().equals(id)) {
                    return data;
                }
            }
        }
        throw new RuntimeException("Could not find event with id " + id);
    }

    /**
     * Get the events of the provided weekdayId
     * @param weekdayId
     * @return
     */
    public List<EventData> getEvents(int weekdayId) {
        return new ArrayList<>(dataMap.get(weekdayId).values());
    }
}
