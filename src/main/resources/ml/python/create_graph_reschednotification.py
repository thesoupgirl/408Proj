from __future__ import print_function

import tensorflow as tf

pStress = tf.placeholder(tf.int32, name='pStress') # Combined stress for All days

# eventStress = tf.placeholder(tf.int32, name="eventStress") # Stress of the event in question

y_ = tf.placeholder(tf.float64, name='target') # Time from the event in question to the predicted reschedule time


iStress = tf.Variable(1., name='iStress') # Influence of stress

# y = (eventStress / (pS * iS)) + (pS * iS) + (eventStress / (pM * tf.clip_by_value(iM, 0, 10))) + (pM * tf.clip_by_value(iM, 0, 10)) +

# y = tf.cast((tf.cast(pS, tf.float32) * tf.clip_by_value(iS, 0, 10)) + (tf.cast(pS, tf.float32) * tf.clip_by_value(iS, 0, 10)) + (tf.cast(pM, tf.float32) * tf.clip_by_value(iM, 0, 10)) + (tf.cast(pM, tf.float32) * tf.clip_by_value(iM, 0, 10)) + (tf.cast(pT, tf.float32) * tf.clip_by_value(iT, 0, 10)) + (tf.cast(pT, tf.float32) * tf.clip_by_value(iT, 0, 10)) + (tf.cast(pW, tf.float32) * tf.clip_by_value(iW, 0, 10)) + (tf.cast(pW, tf.float32) * tf.clip_by_value(iW, 0, 10)) + (tf.cast(pTh, tf.float32) * tf.clip_by_value(iTh, 0, 10)) + (tf.cast(pTh, tf.float32) * tf.clip_by_value(iTh, 0, 10)) + (tf.cast(pF, tf.float32) * tf.clip_by_value(iF, 0, 10)) + (tf.cast(pF, tf.float32) * tf.clip_by_value(iF, 0, 10)) + (tf.cast(pSa, tf.float32) * tf.clip_by_value(iSa, 0, 10)) + (tf.cast(pSa, tf.float32) * tf.clip_by_value(iSa, 0, 10)), tf.float64)

# Minimum time of 5
y = tf.cast(5 + tf.clip_by_value(-5 * tf.cast(pStress, tf.float32) * iStress, 0, 120), tf.float64);

y = tf.identity(y, name='output')

loss = tf.reduce_mean(tf.square(y - y_))
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.01)
train_op = optimizer.minimize(loss, name='train')

init = tf.global_variables_initializer()

# Creating a tf.train.Saver adds operations to the graph to save and
# restore variables from checkpoints.
saver_def = tf.train.Saver().as_saver_def()

print('Operation to initialize variables:       ', init.name)
print('Tensors to feed value pStress:                ', pStress.name)
print('Tensor to feed as training targets:      ', y_.name)
print('Tensor to fetch as prediction:           ', y.name)
print('Operation to train one step:             ', train_op.name)
print('Tensor to be fed for checkpoint filename:', saver_def.filename_tensor_name)
print('Operation to save a checkpoint:          ', saver_def.save_tensor_name)
print('Operation to restore a checkpoint:       ', saver_def.restore_op_name)
print('Tensor to read value of iS               ', iStress.value().name)

with open('../graphs/graph_rescheduling_notification.pb', 'wb') as f:
    f.write(tf.get_default_graph().as_graph_def().SerializeToString())
