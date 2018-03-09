package com.stressmanager.ml;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Calendar;
import java.util.List;
import java.util.Random;
import org.tensorflow.Graph;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.Tensors;

public class ReschedulingMachineLearningManager extends MachineLearningManager {
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
     * @param focusedEventId
     * @param previousWeek
     * @param currentWeek
     */
    public synchronized void trainRescheduling(String focusedEventId, WeekData previousWeek, WeekData currentWeek) {
        // TODO test
        EventData focusedEvent = previousWeek.getEvent(focusedEventId);
        // Focused event stress
        int eventStress = focusedEvent.getStress();
        // The time difference between the original event, and the future event
        int timeDiffTarget = (int)focusedEvent.getEventTime().minus(currentWeek.getEvent(focusedEvent.getEventId()).getEventTime().getMillis()).getMillis();
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

        // Train a bunch of times.
        // (Will be much more efficient if we sent batches instead of individual values).
        final int NUM_EXAMPLES = 200;
        for (int n = 0; n < NUM_EXAMPLES; n++) {
            try (Tensor<Integer> eventStressTensor = Tensors.create(eventStress);
                 Tensor<Float> target = Tensors.create((float)timeDiffTarget);
                 Tensor<Integer> stressSundayTensor = Tensors.create(   stressSunday);
                 Tensor<Integer> stressMondayTensor = Tensors.create(stressMonday);
                 Tensor<Integer> stressTuesdayTensor = Tensors.create(stressTuesday);
                 Tensor<Integer> stressWednesdayTensor = Tensors.create(stressWednesday);
                 Tensor<Integer> stressThursdayTensor = Tensors.create(stressThursday);
                 Tensor<Integer> stressFridayTensor = Tensors.create(stressFriday);
                 Tensor<Integer> stressSaturdayTensor = Tensors.create(stressSaturday)) {
                session.runner()
                        .feed("eventStress", eventStressTensor)
                        .feed("target", target)
                        .feed("pS", stressSundayTensor)
                        .feed("pM", stressMondayTensor)
                        .feed("pT", stressTuesdayTensor)
                        .feed("pW", stressWednesdayTensor)
                        .feed("pTh", stressThursdayTensor)
                        .feed("pF", stressFridayTensor)
                        .feed("pSa", stressSaturdayTensor)
                        .addTarget("train").run();
            }
        }

        System.out.println("Tensors after training:");
        printVariables(session);


        // Checkpoint
        try (Tensor<String> checkpointPrefix =
                     Tensors.create(Paths.get(checkpointDir, "ckpt").toString())){
            session.runner().feed("save/Const", checkpointPrefix).addTarget("save/control_dependency").run();
        }
    }
    public WeekData predictRescheduling(EventData focusedEvent, WeekData currentWeek) {
        // TODO
        return new WeekData();
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


    @Override
    public String getGraphDefFilePath() {
        return myGraphDefFilePath;
    }

    @Override
    public String getCheckpointDir() {
        return myCheckpointDir;
    }
}
