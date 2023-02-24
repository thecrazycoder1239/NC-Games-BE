# Northcoders House of Games API

## Overview

Hello there, weary traveller!

  You have arrived at the repository of my first backend
project, the House of Games API. In this Northcoders project I built an api that accesses board games data in a PostgresQL database. I used a TDD approach for my api endpoints, as well as my error handling. I intend to use this backend service to provide relevant data to my front end architecture.

Please check out the link below to my **hosted application**...

🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻🔻

https://my-board-game-database.onrender.com/api

🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺🔺

## Setup

    1) Fork this repo to your GitHub account

    2) Clone your copy locally using git clone <your-repo-url> in a directory of your choosing

    3) Create a .env.development file setting PGDATABASE=nc_games.
    
    4) Create a .env.test file setting PGDATABASE=nc_games_test. 

    5) Install dependencies using 'npm i'

    6) Drop / create your local database by running 'npm run setup-dbs' 

    7) Seed the databse wih 'npm run seed'

*NB: to run tests use `npm run test <(optional) file.test.js>`*

## Minimum Requirements

* Node.js `v18.12`
* Postgres `15.1`

## Technologies

* PSQL
* JS / node-postgres
* express
* dotenv
* jest, jest-sorted and supertest
* Git and GitHub
* Command Line
* ElephantSQL
* Render