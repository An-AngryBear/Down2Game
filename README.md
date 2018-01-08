# Down2Game

A full stack app with the purpose of matching video game enthusiasts together to form teams for online play. Matches are based on personality, habits, gaming platform, etc. The app features a user-messaging system and a user-matching system

## Technologies used

- Node.js
- Postgres
- Express
- Sequelize
- Express-Session
- Passport
- Pug
- Socket IO
- JQuery
- Bootstrap
- IGDB API

## Set up

- Using git, clone into your directory ```git@github.com:An-AngryBear/Down2Game.git```

- Run ```npm install``` to install dependencies

- create Postgres database cluster with ```initdb```.

- To set up the database, run ```sequelize db:migrate```.

- Then seed the database with the ```sequelize db:seed:all``` command.

- get an API key from [IGDB](https://www.igdb.com/api)

- To run the project, run ```npm start``` on the command line and use whatever port you specify in your .env on localhost

## Upcoming features

- filter system
- display that shows users what time a match typically plays (based on timezone)
- save users as favorites

