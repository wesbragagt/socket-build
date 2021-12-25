FROM node:14

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN mkdir -p apps/client
COPY apps/client/package.json apps/client/package.json
RUN mkdir -p apps/server
COPY apps/server/package.json apps/server/package.json

RUN yarn install --frozen-lockfile --quiet

COPY . ./

# cache first iteration
RUN yarn workspace client build

CMD ["yarn", "start"]
