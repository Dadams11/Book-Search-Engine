const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas'); // Assuming you'll add these based on previous instructions
const { authMiddleware } = require('./utils/auth');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Middleware to use Apollo server with Express
server.applyMiddleware({ app });

// Middleware for serving the production build of React
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

// Fallback middleware for any other routes (important for React Router's BrowserRouter)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Middleware for error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}${server.graphqlPath}`));
});
