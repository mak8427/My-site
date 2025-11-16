FROM python:3.11-slim
LABEL authors="mak"
WORKDIR /k8s_matrix_mul
COPY  app.py /k8s_matrix_mul
RUN pip install fastapi uvicorn numpy pydantic
EXPOSE 1202
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "1202"]
