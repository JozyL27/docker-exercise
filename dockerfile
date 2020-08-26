# stage 1 building the code
FROM node as builder
WORKDIR /src/
COPY package*.json ./
RUN npm install
COPY . .

# stage 2
FROM node
WORKDIR /src/
COPY package*.json ./
COPY ormconfig.docker.json ./ormconfig.json
COPY .env .

EXPOSE 8000
CMD ["npm", "start"]