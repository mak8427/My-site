from fastapi import FastAPI
import numpy as np
from pydantic import BaseModel

app = FastAPI()

class MatrixInput(BaseModel):
    size: int


@app.post("/multiply/")
async def multiply_matrices(matrix_input: MatrixInput):
    n = matrix_input.size

    # Generate two random n x n matrices

    A = np.random.randint(0,10,(n, n))
    B = np.random.randint(0,10(n, n))

    # Perform matrix multiplication
    result = A @ B
    return {"input": A.tolist(), "multiplier": B.tolist(), "result": result.tolist()}