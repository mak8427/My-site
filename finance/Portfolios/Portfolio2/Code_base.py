import pandas as pd
import numpy as np
import numpy.random
import yfinance as yf
class Portfolio:
    def __init__(self, code, cash, assets_df, assets):
        self.code = code
        self.assets = assets  # List of tickers
        self.asset_df = assets_df  # DataFrame of percentage changes
        self.cash = cash
        self.weights = self.random_weight_initialise()
        self.iteration = 0

    def random_weight_initialise(self):
        weights = np.random.random(len(self.assets))  # Random weights for assets
        weights /= weights.sum()  # Normalize weights
        return weights

    def simulation_step(self):
        # Simulate portfolio cash value for a single step
        returns = self.asset_df.iloc[self.iteration].values  # Current returns
        self.cash = self.cash * (1 + np.dot(self.weights, returns))  # Update cash
        self.iteration += 1
        return self.cash




#%%
