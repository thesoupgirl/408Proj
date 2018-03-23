package com.stressmanager.ml;

import java.util.*;
import java.util.stream.Collectors;

public class WeekData {
    // Integer as in the day of the week
    private HashMap<Integer, HashMap<String, EventData>> dataMap;

    public WeekData() {
        dataMap = new HashMap<>();
    }

    public WeekData(RawWeekData raw) {
        // *vomit*
        this(raw.weekdayItems.stream().map(item -> item.get(raw.weekdayItems.indexOf(item))).collect(Collectors.toList()));
    }

    /**
     * Clones an existing weekdata
     * @param toClone
     */
    public WeekData(WeekData toClone) {
        this();
        for (int i = 1; i <= 7; i++) {
            if (toClone.dataMap.get(i) != null) {
                for (Map.Entry<String, EventData> entry : toClone.dataMap.get(i).entrySet()) {
                    addEvent(new EventData(entry.getValue().getEventId(), entry.getValue().getEventTime(), entry.getValue().getStress()));
                }
            }
        }
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
     * Does it have the event
     * does this really need a javadoc
     * @param id
     * @return
     */
    public boolean hasEvent(String id) {
        try {
            getEvent(id);
            return true;
        } catch (RuntimeException e) {
            return false;
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

    @Override
    public boolean equals(Object o) {
        WeekData toCompare = (WeekData)o;
        for (int i = 1; i <= 7; i++) {
            if (toCompare.dataMap.get(i) != null) {
                for (Map.Entry<String, EventData> entry : toCompare.dataMap.get(i).entrySet()) {
                    if (!entry.getValue().equals(toCompare.getEvent(entry.getKey()))) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Convert to RawWeekData
     * @return RawWeekData
     */
    public RawWeekData getRaw() {
        List<List<EventData>> rawData = new ArrayList<>();
        for (int i = 1; i <= 7; i++) {
            rawData.add(new ArrayList(dataMap.get(i).values()));
        }
        return new RawWeekData(rawData);
        //return new RawWeekData(dataMap.values().stream().map(items -> new ArrayList(items.values())).collect(Collectors.toList()));
    }
}
