# Stress Manager

## Project Documentation

[Project Charter](https://docs.google.com/document/d/1MgSNgmPj97zqQZlCLURruOX9UYQXyxo_xUl81jwi4k4/edit?usp=sharing)

[Product Backlog](https://docs.google.com/document/d/1OBjZGVrhTmL1PJG95LB13ZsZtPMM6A06VYqGwWNWzJI/edit?usp=sharing)

[Test Plan](https://docs.google.com/document/d/1Wng8cIEPiLTz2BrBfEY_Hg_nauLI5P6y5QURing2764/edit?usp=sharing)

See the docs folder for PDF copies of these documents.

## Project Setup

Download and install:

* [node](https://nodejs.org/en/) >= 6.9.5
* npm >= 4.1.2
  * `sudo npm i -g npm@latest` after installing node
* [maven](http://maven.apache.org/install.html)

### Frontend

* `npm install` will install all of the frontend dependencies.
* `npm run dev` will watch all files in *client/* for changes, and recompile
*bundle.js* and all other assets.
* `npm run build` to produce a minified version of the bundle an all other assets.

### Backend

* `mvn install` will install all of the backend dependencies.
* `mvn package` will package up the app and put it in *target/*

You can run the backend with `java -jar target/backend-0.0.1-SNAPSHOT.jar`
Then navigate to *localhost:8080* in your web browser.

### Tests

* `npm test` will run all test suites

The output will show in your terminal.  If the snapshot tests do not pass, delete the old snapshots that are files that end in .snap and then re-run the tests.

### Recommended Workflow

First, install all necessary dependencies with `npm install` and `mvn install`.

Then, have one terminal session running `npm run dev`, which will automatically rebuild
the frontend whenever you make changes. When you make changes to the backend
(or frontend, for that matter), kill the server if you have one running and
run `mvn package && java -jar target/backend-0.0.1-SNAPSHOT.jar`
