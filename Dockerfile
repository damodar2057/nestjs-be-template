FROM node:21-alpine

# install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# copy all the files to the docker container (first . => WORKDIR) Note: we can copy all because we are placing .dockerignore 
COPY . .

# install all dependencies
RUN pnpm install


EXPOSE 3000

# starting the server
CMD [ "pnpm", "run", "start:dev" ]


