FROM python:3.10

# Configura el directorio de trabajo
WORKDIR /code

# Copia el archivo de dependencias e instala
COPY ./requirements.txt /code/requirements.txt
RUN pip install --upgrade pip && pip install --no-cache-dir -r /code/requirements.txt

# Copia todo el backend (incluyendo main.py)
COPY . /code

# Expone el puerto
EXPOSE 80

# Ejecuta el servidor FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
