FROM python:3.11-slim
WORKDIR /app
COPY hospital-recommendation-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY hospital-recommendation-service ./
EXPOSE 8003
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8003"]
