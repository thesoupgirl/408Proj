package com.stressmanager.ml;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import org.joda.time.DateTime;
import org.joda.time.DateTimeConstants;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MLTest {
    private class foo {
        public List<String> items;
    }
    public static void main(String[] args) {

        // DUMMY DATA
        List<EventData> priorEvents = new ArrayList<>();
        List<EventData> nextEvents = new ArrayList<>();
        // Gonna make an event every hour, and give them all even stress levels
        Random r = new Random();
        DateTime time = DateTime.now();
        for (int i = 0; i < 24 * 7; i++, time = time.plusHours(1)) {
            if (i % 4 != 0) continue; // Only use a few
            int eventStress = (r.nextInt() % 3) - 1;
            priorEvents.add(new EventData(i + "", time, eventStress, DateTimeConstants.MILLIS_PER_HOUR));
            nextEvents.add(new EventData(i + "", time, eventStress, DateTimeConstants.MILLIS_PER_HOUR));
        }


        WeekData weekData = new WeekData(priorEvents);
        //WeekData nextWeekData = new WeekData(nextEvents);
        //EventData focusedEvent = nextWeekData.getEvent("4");
        //focusedEvent.setEventTime(focusedEvent.getEventTime().plusHours((r.nextInt() % 10) - 5));

        // Random number from 3 to 5
        //WhenReschedulingMachineLearningManager.getInstance().trainReschedulingNotification((Math.abs(r.nextInt()%3)) + 5, weekData);

        //double predictedTime = WhenReschedulingMachineLearningManager.getInstance().predictReschedulingNotification(weekData);

        //ReschedulingMachineLearningManager.getInstance().trainRescheduling(focusedEvent.getEventId(), weekData, nextWeekData);

        //WeekData suggestedWeek = ReschedulingMachineLearningManager.getInstance().predictRescheduling(focusedEvent.getEventId(), nextWeekData);

    }
}
