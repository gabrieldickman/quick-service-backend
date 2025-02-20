FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN rm -rf node_modules
RUN npm i

COPY . .

ENV NODE_ENV=production

EXPOSE 8000

CMD [ "npm" , "start" ]