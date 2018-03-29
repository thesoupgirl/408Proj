package com.stressmanager.ml;

import com.google.common.collect.Lists;
import com.google.gson.Gson;
import org.joda.time.DateTime;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class MLDummyDataTraining_WhenRescheduling {
    public static int TRAINING_COUNT = 50;
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
            priorEvents.add(new EventData(i + "", time, eventStress));
            nextEvents.add(new EventData(i + "", time, eventStress));
        }


        WeekData weekData = new WeekData(priorEvents);

        // Random number from 3 to 5
        for (int i = 0; i < TRAINING_COUNT; i++) {
            WhenReschedulingMachineLearningManager.getInstance().trainReschedulingNotification((Math.abs(r.nextInt() % 3)) + 5, weekData);
        }
        // This may throw exceptions, don't worry
        double predictedTime = WhenReschedulingMachineLearningManager.getInstance().predictReschedulingNotification(weekData);

    }
}
