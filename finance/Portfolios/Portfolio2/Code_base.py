import pandas as pd
import numpy as np
import numpy.random


class Portfolio:
    import numpy as np
    def __init__(self, code, cash, assets, weights):
        self.code = code
        self.assets = assets
        self.cash = cash
        self.weights = self.random_weight_initialise()

    def random_weight_initialise(self):
        weights = np.random.random(len(self.assets))
        weights /= weights.sum()
        return weights


Portfolios = Portfolio(1, 1, ["s", "S"], 3)
print(Portfolios.weights)
