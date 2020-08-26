FROM node as builder
WORKDIR /usr/src/
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]