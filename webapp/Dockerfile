FROM node:16-alpine
LABEL name="LOMAP"
COPY . /app
WORKDIR /app

#Install the dependencies
RUN npm install

#Create an optimized version of the webapp
RUN npm run build

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
#CMD ["npm", "start"]

# To get a the image of the docker on a moment use -> docker save -o lomap.tar lomap
# To use an image once it has been stored can use -> docker load -i lomap.tar
# To execute the image use docker run -p 3000:3000 lomap
