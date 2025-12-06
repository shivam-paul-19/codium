# pull image of node version 20.15.1
FROM node:20.15.1

# set the workinf directory
WORKDIR /home/app

# copy all the package files in the working directory
COPY package*.json .

# install dependencies
RUN npm i

# copy all the files
COPY . .

# exposing the port
EXPOSE 8080

# start the server
CMD [ "npm", "start"]