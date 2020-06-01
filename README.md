# Passport microservice

Service for SignIn and SignOut Users

* Routes validator (clientkey, email, password, etc)
* Sequelize ORM (migrations, models, seeders)
* Multi environments (dotenv)
* Multi strategy (Local, Google, etc)
* Change user data (name, subscribe, referral)
* Main Jwt Auth (jsonwebtoken)
* IP identification
* Google email smtp notifications 
  - smtp notifications 
  - auth email verificate 
  - html templates 
* Local strategy
  - Change password 
* Discord notifications 
* Errors routes 
* Logs (morgan) 
* Tests

# Install

```sh
cd /home/passport/
npm install
nodemon ./start.js
```

# DB

```sh
npx sequelize-cli db:migrate 
npx sequelize-cli db:seed:all
```

# TODO

* Local strategy
  - Password forgot