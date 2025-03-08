# Use an official Python runtime as base image
FROM python:3.10

# Set the working directory
WORKDIR /app

# Copy the backend code
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port for FastAPI
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"]
