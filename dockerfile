FROM node:18.15-alpine

WORKDIR /LooseGoose

ADD index.js .
ADD package.json .
ADD package-lock.json .

RUN npm install

CMD ["node", "./index.js"]