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

public abstract class MachineLearningManager implements AutoCloseable {
    /**
     * Base class for a machine learning manager
     */

    public abstract String getGraphDefFilePath();
    public abstract String getCheckpointDir();

    protected String graphDefFilePath;
    protected String checkpointDir;
    protected Graph graph;
    protected Session session;

    protected MachineLearningManager() {
        graphDefFilePath = getGraphDefFilePath();
        checkpointDir = getCheckpointDir();

        graph = new Graph();

        final byte[] graphDef;
        try {
            graphDef = Files.readAllBytes(Paths.get(graphDefFilePath));
        } catch (IOException e) {
            throw new RuntimeException("Issue with reading graph file, cannot create graph definition");
        }
        final boolean checkpointExists = Files.exists(Paths.get(checkpointDir));

        session = new Session(graph);
        try (Tensor<String> checkpointPrefix =
                Tensors.create(Paths.get(checkpointDir, "ckpt").toString())){
            graph.importGraphDef(graphDef);

            // Initialize or restore
            if (checkpointExists) {
                session.runner().feed("save/Const", checkpointPrefix).addTarget("save/restore_all").run();
            } else {
                session.runner().addTarget("init").run();
            }

        }
    }



    @Override
    public void close() throws Exception {
        graph.close();
        session.close();
    }
}
