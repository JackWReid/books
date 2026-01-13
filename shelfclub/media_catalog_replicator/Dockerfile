FROM node:15.7.0-alpine3.10

RUN apk add bash

WORKDIR /app
ADD ./package.json /
ADD ./package-lock.json /
RUN cd / && npm install

COPY . /app

CMD ["npm", "run", "start"]
