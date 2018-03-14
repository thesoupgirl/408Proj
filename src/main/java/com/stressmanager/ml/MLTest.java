package com.stressmanager.ml;

import com.google.common.collect.Lists;
import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MLTest {
    public static void main(String[] args) {
        // DUMMY DATA
        List<EventData> priorEvents = new ArrayList<>();
        List<EventData> nextEvents = new ArrayList<>();
        // Gonna make an event every hour, and give them all even stress levels
        Random r = new Random();
        DateTime time = DateTime.now();
        for (int i = 0; i < 24 * 7; i++, time = time.plusHours(1)) {
            int eventStress = (r.nextInt() % 3) - 1;
            priorEvents.add(new EventData(i + "", time, eventStress));
            nextEvents.add(new EventData(i + "", time, eventStress));
        }


        WeekData priorWeekData = new WeekData(priorEvents);
        WeekData nextWeekData = new WeekData(nextEvents);
        EventData focusedEvent = nextWeekData.getEvent("4");
        focusedEvent.setEventTime(focusedEvent.getEventTime().plusHours(4));

        ReschedulingMachineLearningManager.getInstance().trainRescheduling(focusedEvent.getEventId(), priorWeekData, nextWeekData);

        WeekData suggestedWeek = ReschedulingMachineLearningManager.getInstance().predictRescheduling(focusedEvent.getEventId(), nextWeekData);

    }
}
