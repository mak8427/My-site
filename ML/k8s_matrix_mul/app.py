from fastapi import FastAPI, Form
import numpy as np
from pydantic import BaseModel

app = FastAPI()

class MatrixInput(BaseModel):
    size: int


@app.post("/multiply/")
async def multiply(dimension: int = Form(...)):
    n = dimension

    # Generate two random n x n matrices

    A = np.random.randint(0,10,(n, n))
    B = np.random.randint(0, 10, (n, n))

    # Perform matrix multiplication
    result = A @ B
    return {"input": A.tolist(), "multiplier": B.tolist(), "result": result.tolist()}