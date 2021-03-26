WORKDIR /usr/src/app

COPY package.json .

RUN npm install

ADD . /usr/src/app

RUN npm run tsc

CMD [ "npm", "start" ]
EXPOSE 99