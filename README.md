# Aurelia website game that communicates with Sphero via node

A game application for using the Aurelia Javascript framework with Node.js as the server that will send instruction to Sphero

## Structure
``client:``
Aurelia-Framework

``server``
 Node.js


## Installing
First you need to go into the ``client`` folder and run the usual commands to install the front-end tooling and dependencies:

- npm install
- jspm install -y

Then you need to go into the ``server`` folder and just run: ``npm install`` to install the server side dependencies.

## Running
To run, go into ``server`` and type ``node server`` it will run on port 9000 by default.
Then visit: ``http://localhost:9000`` to see the app running.