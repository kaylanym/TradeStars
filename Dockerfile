# Use Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Make start script executable
RUN chmod +x backend/start.sh

# Set environment variable
ENV PYTHONPATH=/app/backend

# Start command
CMD ["bash", "backend/start.sh"]
