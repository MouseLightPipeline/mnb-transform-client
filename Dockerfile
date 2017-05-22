FROM node:7.10

WORKDIR /app

RUN yarn global add typescript

COPY . .

RUN yarn install

RUN tsc

CMD ["npm", "run", "debug"]

EXPOSE  9663
