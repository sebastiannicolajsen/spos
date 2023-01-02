FROM node:18.11.0-alpine

WORKDIR /spos-app

COPY package*.json environment.d.ts tsconfig.json postcss.config.js tailwind.config.js /spos-app

COPY ./src ./src
COPY ./public ./public

RUN npm install
RUN npm run build
CMD npm start
