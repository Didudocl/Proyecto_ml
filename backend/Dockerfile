FROM python:3.10

WORKDIR /app/backend

COPY ./requirements.txt /app/backend/requirements.txt

RUN apt-get update && apt-get install -y tesseract-ocr libtesseract-dev

RUN pip install -r requirements.txt

COPY . /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
