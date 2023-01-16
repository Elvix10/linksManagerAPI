FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --production

COPY . .

CMD ["npx", "adonis", "serve", "--dev"]