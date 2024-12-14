import pandas as pd
import numpy as np
import numpy.random
import yfinance as yf
class Portfolio:
    def __init__(self, code, cash, assets_df, tickers):
        self.assets = None
        self.code = code
        self.tickers = tickers  # List of tickers
        self.asset_df = assets_df  # DataFrame of percentage changes
        self.cash = cash
        self.weights = self.random_weight_initialise()
        self.iteration = 0

    def random_weight_initialise(self):
        weights = np.random.random(len(self.tickers))  # Random weights for assets
        weights /= weights.sum()  # Normalize weights
        return weights
    def initialise_portfolio(self):
        self.assets = [self.cash * x  for x in self.weights]  # Initial asset values
        self.assets = np.array(self.assets)
        self.cash = 0

    def  withdraw_cash(self, amount):
        if amount > self.cash :

            #Use all Cash
            amount = amount - self.cash
            self.cash = 0

            #Sell assets proportional to the weights if you have enought of them
            if np.sum(self.assets) > amount:
                _ = self.assets
                for i in  range(len(self.tickers)):
                    #Decrease only if oyu have enough
                    if self.assets[i] > self.weights[i] * amount:
                        self.assets[i] = self.assets[i] - self.weights[i] * amount
                    else:
                        amount -= self.assets[i]
                        self.assets[i] = 0




                print(f"Asset sold Withdrawn:  {np.subtract(_,self.assets)}   for a total of: {np.sum(np.subtract(_,self.assets))}" )
            else:
                print("Not Enough assets")

        else:
            self.cash -= amount
            print("Too Poor")




    def simulation_step(self):
        # Simulate portfolio cash value for a single step
        returns = self.asset_df.iloc[self.iteration].values  # Current returns
        self.assets = [self.assets[i] * (1 + returns[i]) for i in range(len(self.tickers))]
        self.iteration += 1
        return self.cash


