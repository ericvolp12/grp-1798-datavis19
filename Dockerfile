FROM node:8

ARG build_env=dev

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /p1-scaffold/package*.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY /p1-scaffold/. .

EXPOSE 9966
CMD [ "npm", "run", "lint" ]
