#building an image of this auth ms
FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

#CMD ["npm", "run", "dev"]
CMD ["npm", "start"]