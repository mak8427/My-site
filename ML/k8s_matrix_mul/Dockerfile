FROM python:3.11-slim
WORKDIR /k8s_matrix_mul

# Copy app and templates folder
COPY app.py /k8s_matrix_mul/
COPY templates /k8s_matrix_mul/templates

RUN pip install fastapi uvicorn numpy pydantic jinja2 python-multipart
EXPOSE 1202
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "1202"]
