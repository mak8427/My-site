from time import time
import numpy as np
from random import random
from operator import add

from pyspark.sql import SparkSession

spark = SparkSession.builder.appName('CalculatePi').getOrCreate()
sc = spark.sparkContext

n = 10000000


def is_point_inside_unit_circle(p):
    # p is useless here
    x, y = random(), random()
    return 1 if x*x + y*y < 1 else 0


t_0 = time()

# parallelize creates a spark Resilient Distributed Dataset (RDD)
# its values are useless in this case
# but allows us to distribute our calculation (inside function)
count = sc.parallelize(range(0, n)) \
             .map(is_point_inside_unit_circle).reduce(add)
print(np.round(time()-t_0, 3), "seconds elapsed for spark approach and n=", n)
print("Pi is roughly %f" % (4.0 * count / n))

# VERY important to stop SparkSession
# Otherwise, the job will keep running indefinitely
spark.stop()