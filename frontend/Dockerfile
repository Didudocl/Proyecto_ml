FROM node:20.14.0

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

EXPOSE 5173

CMD ["sh", "-c", "cd /app/frontend && npm run dev -- --host 0.0.0.0"]