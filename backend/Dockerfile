FROM node:10

RUN groupadd -r nodejs && useradd -m -r -g -s /bin/bash nodejs nodejs

USER nodejs

WORKDIR /usr/src/app

RUN mkdir ./logs

COPY package*.json ./

RUN npm install --production

COPY . .

ENV  NODE_ENV production

EXPOSE 1313

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && npm start