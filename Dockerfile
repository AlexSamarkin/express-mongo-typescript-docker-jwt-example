FROM node:12-alpine as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./

RUN npm run build


FROM node:12-alpine

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000

CMD npm run start:prod