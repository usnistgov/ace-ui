FROM node:17.5-buster-slim

# Create app directory
WORKDIR /usr/src/app


COPY . .

#delete homepage in package.json, so ui will work using node serve
RUN sed -i '/homepage/d' package.json
RUN npm install
RUN npm run build
EXPOSE 3549
CMD [ "serve", "-s","build", "-p", "3549"]
