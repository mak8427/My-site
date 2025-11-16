from fastapi import FastAPI, Request, Form
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
import numpy as np

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/multiply")
def multiply(request: Request, dimension: int = Form(...)):
    n = dimension
    A = np.random.randint(0, 10, (n, n))
    B = np.random.randint(0, 10, (n, n))
    result = A @ B
    return templates.TemplateResponse(
        "result.html", {
          "request": request,
          "input_matrix": str(A),
          "multiplier_matrix": str(B),
          "result_matrix": str(result)
        }
    )
