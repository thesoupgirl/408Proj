package com.stressmanager.ml;

import org.joda.time.DateTimeConstants;
import org.tensorflow.Session;
import org.tensorflow.Tensor;
import org.tensorflow.Tensors;

import java.nio.file.Paths;
import java.util.Calendar;
import java.util.List;

public class WhenReschedulingMachineLearningManager extends MachineLearningManager {

    public static int TRAINING_COUNT = 200;

    private static final String myGraphDefFilePath = "./src/main/resources/ml/graphs/graph_rescheduling_notification.pb";
    private static final String myCheckpointDir = "./src/main/resources/ml/checkpoints/checkpoint_rescheduling_notification";

    /**
     * Since scheduling your own weekdays can be monotonous, we decided to create a machine learning manager that can take care of that duty.
     * This class helps us train
     */

    // Singleton nonsense
    private static WhenReschedulingMachineLearningManager ourInstance = new WhenReschedulingMachineLearningManager();

    public static synchronized WhenReschedulingMachineLearningManager getInstance() {
        return ourInstance;
    }

    /**
     * Train the rescheduling algorithm by providing an event, and two different versions of the same week where that event was rescheduled.
     *
     * @param timeTaken
     * @param currentWeek
     */
    public synchronized void trainReschedulingNotification(double timeTaken, WeekData currentWeek) {

        // Combined stresses
        int stressSunday = currentWeek.getEvents(Calendar.SUNDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressMonday = currentWeek.getEvents(Calendar.MONDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressTuesday = currentWeek.getEvents(Calendar.TUESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressWednesday = currentWeek.getEvents(Calendar.WEDNESDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressThursday = currentWeek.getEvents(Calendar.THURSDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressFriday = currentWeek.getEvents(Calendar.FRIDAY).stream().mapToInt(event -> event.getStress()).sum();
        int stressSaturday = currentWeek.getEvents(Calendar.SATURDAY).stream().mapToInt(event -> event.getStress()).sum();


        System.out.println("Tensors before training:");
        printVariables(session);
        System.out.printf("pS: %d\n", stressSunday);
        System.out.printf("pM: %d\n", stressMonday);
        System.out.printf("pT: %d\n", stressTuesday);
        System.out.printf("pW: %d\n", stressWednesday);
        System.out.printf("pTh: %d\n", stressThursday);
        System.out.printf("pF: %d\n", stressFriday);
        System.out.printf("pSa: %d\n", stressSaturday);
        System.out.printf("timeDiffTarget: %f\n", timeTaken);


        // Train a bunch of times.
        // (Will be much more efficient if we sent batches instead of individual values).
        for (int n = 0; n < TRAINING_COUNT; n++) {
            try (
                    Tensor<Double> target = Tensors.create(timeTaken);
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
     * Predict how to reschedule
     * @param currentWeek
     * @return - A float that is our expected return time
     */
    public double predictReschedulingNotification(WeekData currentWeek) {
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
            System.out.printf("Expected reschedule time: %f seconds\n", outputValue);
            return outputValue;
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
        System.out.printf("influenceS: %f\n", values.get(0).floatValue());
        System.out.printf("influenceM: %f\n", values.get(1).floatValue());
        System.out.printf("influenceT: %f\n", values.get(2).floatValue());
        System.out.printf("influenceW: %f\n", values.get(3).floatValue());
        System.out.printf("influenceTh: %f\n", values.get(4).floatValue());
        System.out.printf("influenceF: %f\n", values.get(5).floatValue());
        System.out.printf("influenceSa: %f\n", values.get(6).floatValue());
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
