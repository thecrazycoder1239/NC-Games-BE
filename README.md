# Northcoders House of Games API

Hello there, weary traveller!

You have arrived at the repository of my first backend project, the House of Games API. In this project I seed a database with data about board games and create an express application with endpoints that access this PostgresQL database. I used a TDD approach for my endpoints, as well as my error handling, with the aid of supertest. Please check out the link below to my hosted application...

https://my-board-game-database.onrender.com/api

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you would like to clone this repository, feel free to do so! Once you have done this, please run 'npm i' in your terminal in order to install the relevant dependencies, and check out the json.package scripts for info on seeding and running tests (you can ignore 'seed-prod').

You must also create a .env.development file setting PGDATABASE=nc_games, and a .env.test file setting PGDATABASE=nc_games_test, in order to successfully connect the two databases locally. 

