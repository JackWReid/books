FROM node:lts-alpine

RUN apk add bash postgresql curl

WORKDIR /app
ADD ./package.json /
ADD ./package-lock.json /
RUN cd / && npm install

COPY . /app

CMD ["npm", "run", "start"]
