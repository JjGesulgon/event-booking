const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const app = express();
const events = [];

app.use(bodyParser.json());

app.use('/api', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            venue: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
            venue: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    
    //resolvers
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date,
                venue: args.eventInput.venue
            }
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

app.get('/', (req, res, next) => {
    res.send('Event Booking');
});

//DB Connection
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@cluster0.o59il.mongodb.net/<dbname>?retryWrites=true&w=majority`
)
.then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});

