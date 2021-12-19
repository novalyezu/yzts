FROM node:14.18.0

ENV NODE_ENV=staging
ENV ENV=staging
ENV HOST_NAME=localhost
ENV PORT=3000
ENV BASE_URL=https://api.novalyezu.com
ENV MYSQL_DB_NAME=database
ENV MYSQL_HOST=localhost
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=
ENV GOOGLE_CLOUD_PROJECT_ID=
ENV GOOGLE_API_KEY=
ENV SENDGRID_API_KEY=
ENV TELEGRAM_BOT_TOKEN=

WORKDIR /app

COPY . .

RUN npm install

RUN npm install --only=dev

RUN npm install pm2 -g

RUN npm run build

COPY bin/configs/*.json dist/configs/

EXPOSE 3000

CMD ["pm2-runtime", "dist/app.js"]
