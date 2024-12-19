FROM node:20.14.0

WORKDIR /app/frontend

COPY ./package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]