FROM python:3.11-slim
WORKDIR /app
COPY ai-severity-service/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY ai-severity-service ./
RUN python generate_dataset.py && python train_model.py
EXPOSE 8001
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]
