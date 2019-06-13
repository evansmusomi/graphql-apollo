import dotenv from 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('eMusomi'),
  }),
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    console.log('Apollo server on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      name: 'eMusomi',
      email: 'evans@gmail.com',
      messages: [
        {
          text: 'Created Apollo Graphql Server with Postgres',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      name: 'eMaiyo',
      email: 'elton@gmail.com',
      messages: [
        {
          text: 'Learned NextJS for SSR React app dev',
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};
