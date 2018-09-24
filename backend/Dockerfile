FROM node:10

WORKDIR /usr/src/app

RUN mkdir ./logs

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 1337

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start