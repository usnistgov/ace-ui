FROM node:14.18-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install serve -g
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
EXPOSE 3549
CMD [ "serve", "-s","build", "-p", "3549"]
