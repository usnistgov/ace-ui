FROM node:17.5-buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install serve -g
COPY package*.json ./

RUN npm install

COPY . .
#RUN cat .env
#copy standlaone environment as .env ,so npm run build will use the env variable
#COPY .env.standalone ./.env

#delete homepage in package.json, so ui will work using node serve
RUN sed -i '/homepage/d' package.json

RUN npm run build
EXPOSE 3549
CMD [ "serve", "-s","build", "-p", "3549"]
