FROM node:18.4-alpine3.16 

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# RUN npm run build

CMD ["npm", "run", "start"]
