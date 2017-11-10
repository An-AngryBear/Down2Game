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
- JQuery
- Bootstrap

## Set up

- Using git, clone into your directory ```git@github.com:An-AngryBear/Down2Game.git```

- Run ```npm install``` to install dependencies

- create Postgres database cluster with ```initdb```.

- To set up the database, run ```sequelize db:migrate```.

- Then seed the database with the ```sequelize db:seed:all``` command.

- create ```/public/values``` folder

- in this folder create a file called ```igdb-config``` with this inside:

    ```
    module.exports.igdb = () => {
        return {
            key: *****IGDB API KEY HERE*****
        }
    }
    ```

- To run the project, run ```npm start``` on the command line and use whatever port you specify in your .env on localhost

