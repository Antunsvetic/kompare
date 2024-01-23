FROM node:18.17.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g npm@latest && \
 npm install -g typescript ts-node && \
 npm install --silent && \
 rm -rf node_modules/.cache

COPY . ./

CMD ["npm", "start"]

EXPOSE 5000