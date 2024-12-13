import pandas as pd
import numpy as np
import numpy.random
import yfinance as yf
class Portfolio:
    import numpy as np
    def __init__(self, code, cash, assets_df, weights):
        self.code = code
        self.asset_df = assets_df
        self.cash = cash
        self.weights = self.random_weight_initialise()

    def random_weight_initialise(self):
        weights = np.random.random(len(self.assets))
        weights /= weights.sum()
        return weights
    def simulation:



Portfolios = Portfolio(1, 1, ["s", "S"], 3)
print(Portfolios.weights)
