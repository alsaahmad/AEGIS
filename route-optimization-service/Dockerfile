FROM python:3.11-slim
WORKDIR /app
COPY route-optimization-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY route-optimization-service ./
EXPOSE 8002
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"]
