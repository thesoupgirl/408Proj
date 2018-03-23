from __future__ import print_function

import tensorflow as tf

pS = tf.placeholder(tf.int32, name='pS') # Combined stress for Sunday
pM = tf.placeholder(tf.int32, name='pM') # Combined stress for Monday
pT = tf.placeholder(tf.int32, name='pT') # Combined stress for Tuesday
pW = tf.placeholder(tf.int32, name='pW') # Combined stress for Wednesday
pTh = tf.placeholder(tf.int32, name='pTh') # Combined stress for Thursday
pF = tf.placeholder(tf.int32, name='pF') # Combined stress for Friday
pSa = tf.placeholder(tf.int32, name='pSa') # Combined stress for Saturday

# eventStress = tf.placeholder(tf.int32, name="eventStress") # Stress of the event in question

y_ = tf.placeholder(tf.float64, name='target') # Time from the event in question to the predicted reschedule time


iS = tf.Variable(1., name='iS') # Influence of Sunday
iM = tf.Variable(1., name='iM') # Influence of Monday
iT = tf.Variable(1., name='iT') # Influence of Tuesday
iW = tf.Variable(1., name='iW') # Influence of Wednesday
iTh = tf.Variable(1., name='iTh') # Influence of Thursday
iF = tf.Variable(1., name='iF') # Influence of Friday
iSa = tf.Variable(1., name='iSa') # Influence of Saturday

# y = (eventStress / (pS * iS)) + (pS * iS) + (eventStress / (pM * iM)) + (pM * iM) +

y = tf.cast((tf.cast(pS, tf.float32) * iS) + (tf.cast(pS, tf.float32) * iS) + (tf.cast(pM, tf.float32) * iM) + (tf.cast(pM, tf.float32) * iM) + (tf.cast(pT, tf.float32) * iT) + (tf.cast(pT, tf.float32) * iT) + (tf.cast(pW, tf.float32) * iW) + (tf.cast(pW, tf.float32) * iW) + (tf.cast(pTh, tf.float32) * iTh) + (tf.cast(pTh, tf.float32) * iTh) + (tf.cast(pF, tf.float32) * iF) + (tf.cast(pF, tf.float32) * iF) + (tf.cast(pSa, tf.float32) * iSa) + (tf.cast(pSa, tf.float32) * iSa), tf.float64)

y = tf.identity(y, name='output')

loss = tf.reduce_sum(tf.log(y - y_))
optimizer = tf.train.GradientDescentOptimizer(learning_rate=0.01)
train_op = optimizer.minimize(loss, name='train')

init = tf.global_variables_initializer()

# Creating a tf.train.Saver adds operations to the graph to save and
# restore variables from checkpoints.
saver_def = tf.train.Saver().as_saver_def()

print('Operation to initialize variables:       ', init.name)
print('Tensors to feed value pS:                ', pS.name)
print('Tensors to feed value pM:                ', pM.name)
print('Tensors to feed value pT:                ', pT.name)
print('Tensors to feed value pW:                ', pW.name)
print('Tensors to feed value pTh:               ', pTh.name)
print('Tensors to feed value pF:                ', pF.name)
print('Tensors to feed value pSa:               ', pSa.name)
print('Tensor to feed as training targets:      ', y_.name)
print('Tensor to fetch as prediction:           ', y.name)
print('Operation to train one step:             ', train_op.name)
print('Tensor to be fed for checkpoint filename:', saver_def.filename_tensor_name)
print('Operation to save a checkpoint:          ', saver_def.save_tensor_name)
print('Operation to restore a checkpoint:       ', saver_def.restore_op_name)
print('Tensor to read value of iS               ', iS.value().name)
print('Tensor to read value of iM               ', iM.value().name)
print('Tensor to read value of iT               ', iT.value().name)
print('Tensor to read value of iW               ', iW.value().name)
print('Tensor to read value of iTh              ', iTh.value().name)
print('Tensor to read value of iF               ', iF.value().name)
print('Tensor to read value of iSa              ', iSa.value().name)

with open('../graphs/graph_rescheduling.pb', 'wb') as f:
    f.write(tf.get_default_graph().as_graph_def().SerializeToString())
