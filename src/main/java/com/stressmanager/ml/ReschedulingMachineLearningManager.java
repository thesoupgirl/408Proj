package com.stressmanager.ml;

import org.joda.time.DateTimeConstants;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.Tensors;

import java.nio.file.Paths;
import java.util.Calendar;
import java.util.List;

public class ReschedulingMachineLearningManager extends MachineLearningManager {
    private static final double FLOAT_TO_MILLIS_CONVERSION_RATE = DateTimeConstants.MILLIS_PER_HOUR;

    private static final String myGraphDefFilePath = "./src/main/resources/ml/graphs/graph_rescheduling.pb";
    private static final String myCheckpointDir = "./src/main/resources/ml/checkpoints/checkpoint_rescheduling";

    /**
     * Since scheduling your own weekdays can be monotonous, we decided to create a machine learning manager that can take care of that duty.
     * This class helps us train
     */

    // Singleton nonsense
    private static ReschedulingMachineLearningManager ourInstance = new ReschedulingMachineLearningManager();

    public static synchronized ReschedulingMachineLearningManager getInstance() {
        return ourInstance;
    }

    /**
     * Train the rescheduling algorithm by providing an event, and two different versions of the same week where that event was rescheduled.
     *
     * @param focusedEventId
     * @param previousWeek
     * @param currentWeek
     */
    public synchronized void trainRescheduling(String focusedEventId, WeekData previousWeek, WeekData currentWeek) {
        if (!previousWeek.hasEvent(focusedEventId)) {
            throw new RuntimeException("Could not find focused event in the previous provided week");
        }
        if (!currentWeek.hasEvent(focusedEventId)) {
            throw new RuntimeException("Could not find focused event in the newest provided week");
        }
        EventData focusedEvent = previousWeek.getEvent(focusedEventId);
        // Focused event stress
        // The time difference between the original event, and the future event
        // Note: in HOURS
        double timeDiffTarget = -1 * (currentWeek.getEvent(focusedEventId).getEventTime().getMillis() - previousWeek.getEvent(focusedEvent.getEventId()).getEventTime().getMillis()) / FLOAT_TO_MILLIS_CONVERSION_RATE;
        // Combined stresses
        int stressSunday = previousWeek.getEvents(Calendar.SUNDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressMonday = previousWeek.getEvents(Calendar.MONDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressTuesday = previousWeek.getEvents(Calendar.TUESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressWednesday = previousWeek.getEvents(Calendar.WEDNESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressThursday = previousWeek.getEvents(Calendar.THURSDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressFriday = previousWeek.getEvents(Calendar.FRIDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressSaturday = previousWeek.getEvents(Calendar.SATURDAY).stream().mapToInt(event -> event.getStress()).sum();


        System.out.println("Tensors before training:");
        printVariables(session);
        System.out.printf("pS: %d\n", stressSunday);
        System.out.printf("pM: %d\n", stressMonday);
        System.out.printf("pT: %d\n", stressTuesday);
        System.out.printf("pW: %d\n", stressWednesday);
        System.out.printf("pTh: %d\n", stressThursday);
        System.out.printf("pF: %d\n", stressFriday);
        System.out.printf("pSa: %d\n", stressSaturday);
        System.out.printf("timeDiffTarget: %f\n", timeDiffTarget);


        // Train a bunch of times.
        // (Will be much more efficient if we sent batches instead of individual values).
        final int NUM_EXAMPLES = 200;
        for (int n = 0; n < NUM_EXAMPLES; n++) {
            try (
                 Tensor<Double> target = Tensors.create(timeDiffTarget);
                 Tensor<Integer> stressSundayTensor = Tensors.create(stressSunday);
                 Tensor<Integer> stressMondayTensor = Tensors.create(stressMonday);
                 Tensor<Integer> stressTuesdayTensor = Tensors.create(stressTuesday);
                 Tensor<Integer> stressWednesdayTensor = Tensors.create(stressWednesday);
                 Tensor<Integer> stressThursdayTensor = Tensors.create(stressThursday);
                 Tensor<Integer> stressFridayTensor = Tensors.create(stressFriday);
                 Tensor<Integer> stressSaturdayTensor = Tensors.create(stressSaturday)) {
                session.runner()
                        .feed("target", target)
                        .feed("pS", stressSundayTensor)
                        .feed("pM", stressMondayTensor)
                        .feed("pT", stressTuesdayTensor)
                        .feed("pW", stressWednesdayTensor)
                        .feed("pTh", stressThursdayTensor)
                        .feed("pF", stressFridayTensor)
                        .feed("pSa", stressSaturdayTensor)
                        .addTarget("train").run();
                //printVariables(session);
            }
        }

        System.out.println("Tensors after training:");
        printVariables(session);


        // Checkpoint
        try (Tensor<String> checkpointPrefix =
                     Tensors.create(Paths.get(checkpointDir, "ckpt").toString())) {
            session.runner().feed("save/Const", checkpointPrefix).addTarget("save/control_dependency").run();
        }
    }

    /**
     * Predict how to reschedule an event
     *
     * @param focusedEventId
     * @param currentWeek
     * @return - A new week, otherwise currentWeek if machine learning fails to provide an acceptable date
     */
    public WeekData predictRescheduling(String focusedEventId, WeekData currentWeek) {
        // Combined stresses
        int stressSunday = currentWeek.getEvents(Calendar.SUNDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressMonday = currentWeek.getEvents(Calendar.MONDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressTuesday = currentWeek.getEvents(Calendar.TUESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressWednesday = currentWeek.getEvents(Calendar.WEDNESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressThursday = currentWeek.getEvents(Calendar.THURSDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressFriday = currentWeek.getEvents(Calendar.FRIDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressSaturday = currentWeek.getEvents(Calendar.SATURDAY).stream().mapToInt(event -> event.getStress()).sum();

        System.out.println("Inputs upon retrieval");
        printVariables(session);
        System.out.printf("pS: %d\n", stressSunday);
        System.out.printf("pM: %d\n", stressMonday);
        System.out.printf("pT: %d\n", stressTuesday);
        System.out.printf("pW: %d\n", stressWednesday);
        System.out.printf("pTh: %d\n", stressThursday);
        System.out.printf("pF: %d\n", stressFriday);
        System.out.printf("pSa: %d\n", stressSaturday);


        WeekData suggestedWeek = new WeekData(currentWeek);

        try (
             Tensor<Integer> stressSundayTensor = Tensors.create(stressSunday);
             Tensor<Integer> stressMondayTensor = Tensors.create(stressMonday);
             Tensor<Integer> stressTuesdayTensor = Tensors.create(stressTuesday);
             Tensor<Integer> stressWednesdayTensor = Tensors.create(stressWednesday);
             Tensor<Integer> stressThursdayTensor = Tensors.create(stressThursday);
             Tensor<Integer> stressFridayTensor = Tensors.create(stressFriday);
             Tensor<Integer> stressSaturdayTensor = Tensors.create(stressSaturday);
             Tensor<Double> output = session.runner()
                     .feed("pS", stressSundayTensor)
                     .feed("pM", stressMondayTensor)
                     .feed("pT", stressTuesdayTensor)
                     .feed("pW", stressWednesdayTensor)
                     .feed("pTh", stressThursdayTensor)
                     .feed("pF", stressFridayTensor)
                     .feed("pSa", stressSaturdayTensor)
                     .fetch("output").run().get(0).expect(Double.class)
        ) {
            double outputValue = output.doubleValue();
            System.out.printf("Expected time difference: %f hours (%f days)\n", outputValue, outputValue / DateTimeConstants.HOURS_PER_DAY);
            applyRescheduleSuggestion(suggestedWeek, focusedEventId, (long)(-1 * outputValue * FLOAT_TO_MILLIS_CONVERSION_RATE));
            return suggestedWeek;
        }
    }

    protected void printVariables(Session sess) {
        List<Tensor<?>> values = sess.runner()
                .fetch("iS/read")
                .fetch("iM/read")
                .fetch("iT/read")
                .fetch("iW/read")
                .fetch("iTh/read")
                .fetch("iF/read")
                .fetch("iSa/read")
                .run();
        System.out.printf("iS: %f\n", values.get(0).floatValue());
        System.out.printf("iM: %f\n", values.get(1).floatValue());
        System.out.printf("iT: %f\n", values.get(2).floatValue());
        System.out.printf("iW: %f\n", values.get(3).floatValue());
        System.out.printf("iTh: %f\n", values.get(4).floatValue());
        System.out.printf("iF: %f\n", values.get(5).floatValue());
        System.out.printf("iSa: %f\n", values.get(6).floatValue());
        for (Tensor<?> t : values) {
            t.close();
        }
    }

    /**
     * Make any changes or verifications that need to occur with the given data
     *
     * @param weekInput
     * @param eventId
     * @param newEventTimeDiff
     * @return the verified weekdata, NULL if the weekdata fails any of our verifications
     */
    public void applyRescheduleSuggestion(WeekData weekInput, String eventId, long newEventTimeDiff) {
        EventData focusedEvent = null;
        try {
            focusedEvent = weekInput.getEvent(eventId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Could not find event " + eventId + " in the current week");

        }
        long originalEventTime = focusedEvent.getEventTime().getMillis();
        long newEventTime = originalEventTime + newEventTimeDiff;
        focusedEvent.setEventTime(focusedEvent.getEventTime().plus(newEventTimeDiff));


        // verify nothing overlaps
        // Assuming 1 hour overlaps
        for (int i = 1; i <= 7; i++) {
            if (weekInput.getEvents(i) != null) {
                for (EventData e : weekInput.getEvents(i)) {
                    if (Math.abs(e.getEventTime().getMillis() - newEventTime) < DateTimeConstants.MILLIS_PER_HOUR && e.getEventId() != focusedEvent.getEventId()) {
                        throw new RuntimeException("Rescheduled time (" + focusedEvent + ") was too close to event: " + e.toString());
                    }
                }
            }
        }
        
        // verify new date is within one week
        // may not need this one if that many people reschedule weeks away
        if (Math.abs(originalEventTime - newEventTime) > DateTimeConstants.MILLIS_PER_WEEK) {
            throw new RuntimeException("Rescheduled time was outside of the acceptable range of one week");
        }

        // TODO weekends/overnight?

    }



    @Override
    public String getGraphDefFilePath() {
        return myGraphDefFilePath;
    }

    @Override
    public String getCheckpointDir() {
        return myCheckpointDir;
    }
}
