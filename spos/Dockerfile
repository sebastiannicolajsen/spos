FROM node:18.11.0-alpine

WORKDIR /usr/src/spos

COPY package*.json environment.d.ts tsconfig.json /usr/src/spos/

COPY ./src ./src

RUN npm install
RUN npm run build

CMD ["/bin/sh","-c","npm run seeding && npm start"]
