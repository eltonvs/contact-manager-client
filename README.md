# Contact Manager Client

A Client for managing contacts and their information

## Description
This is a simple client to manage contacts, it uses the [Contact Manager API](https://github.com/eltonvs/contact-manager-api) to provide contact information and CRUD functionality.

Every contact has a name (first name and last name), a date of birth, at least one email, at least one phone number and can also have zero or many addresses.

### Features
* Utilized custom components to avoid code duplication
* Validate inputs before sending to server (and on server-side)
* Full responsive layout
* Made use of MapBox GL API to pin on map the user's addresses (using geocoding to convert from address to coordinates)
* Created Birthdays of the month section to show all contacts that have birthday on the current month.

## Built With

* [Vue.js](https://vuejs.org/) - Javascript Web Framework
* [Sass](https://sass-lang.com/) - CSS Preprocessor
* [Bulma/Buefy](https://bulma.io/) - CSS Framework
* [Yarn](https://yarnpkg.com/) - Javascript package manager
* [MapBox GL](https://www.mapbox.com/) - Maps API provider
* [Prettier](https://prettier.io/) - Code Formatter
* [eslint](https://eslint.org/) - Javascript Linter

## Author

[![Elton Viana](https://avatars.githubusercontent.com/eltonvs?s=100)<br /><sub>Elton Viana</sub>](https://github.com/eltonvs) 
| :---: | 

### Installation

```shell
$ git clone git@github.com:eltonvs/contact-manager-client.git
$ cd contact-manager-client
$ yarn install
$ yarn serve
```
