<template>
  <div class="about section">
    <div class="container">
      <div class="content has-text-left">
        <h1>About</h1>
        <p>
          This is a simple client to manage contacts, in which every contact has a name (first name and last name),
          a date of birth, at least one email, at least one phone number and can also have zero or many addresses.
        </p>

        <hr>

        <h2>Client</h2>
        <p>
          The client application was developed with the Vue.js framework.<br>
          The source code is hosted at
          <a target="_blank" href="https://github.com/eltonvs/contact-manager-client">
            GitHub <i class="fab fa-github"></i>
          </a>.
        </p>

        <h3>Features</h3>
        <ul>
          <li>Utilized custom components to avoid code duplication</li>
          <li>Validate inputs before sending to server (and on server-side)</li>
          <li>Full responsive layout</li>
          <li>Made use of MapBox GL API to pin on map the user's addresses (using geocoding to convert from address to
            coordinates)
          </li>
          <li>Created Birthdays of the month section to show all contacts that have birthday on the current month.</li>
        </ul>

        <h3>Technologies Used</h3>
        <ul>
          <li><a target="_blank" href="https://vuejs.org/">Vue.js</a> - Javascript Web Framework</li>
          <li><a target="_blank" href="https://sass-lang.com/">Sass</a> - CSS Preprocessor</li>
          <li><a target="_blank" href="https://bulma.io/">Bulma/Buefy</a> - CSS Framework</li>
          <li><a target="_blank" href="https://yarnpkg.com/">Yarn</a> - Javascript package manager</li>
          <li><a target="_blank" href="https://www.mapbox.com/">MapBox GL</a> - Maps API provider</li>
          <li><a target="_blank" href="https://prettier.io/">Prettier</a> - Code Formatter</li>
          <li><a target="_blank" href="https://eslint.org/">eslint</a> - Javascript Linter</li>
        </ul>

        <hr>

        <h2>API</h2>
        <p>
          This RESTful API was developed in Python using the Django Rest Framework, its main purpose is to store and
          provide contact information and CRUD functionality to his clients.<br>
          Test-driven development <em>(TDD)</em> was used as one of the main development techniques in this project, as
          a way to guarantee good code quality, maintainability and easier refactoring.
          The source code is hosted at
          <a target="_blank" href="https://github.com/eltonvs/contact-manager-api">
            GitHub <i class="fab fa-github"></i>
          </a>.
        </p>

        <h3>Endpoints</h3>
        <p>This API in on version <code>v1</code>, so his base url is <code>http://host:port/contactmanager/v1</code>.
        </p>
        <table class="table table-striped table-bordered">
          <thead>
          <tr>
            <th>URL</th>
            <th>Method</th>
            <th>Description</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td><code>/contacts</code></td>
            <td>GET</td>
            <td>Retrieve all contacts</td>
          </tr>
          <tr>
            <td><code>/contacts</code></td>
            <td>POST</td>
            <td>Create a new contact</td>
          </tr>
          <tr>
            <td><code>/contacts/search</code></td>
            <td>GET</td>
            <td>Search a contact by a given <code>query</code></td>
          </tr>
          <tr>
            <td><code>/contacts/birthdays</code></td>
            <td>GET</td>
            <td>Retrive all contacts from birthdays of the month list</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId</code></td>
            <td>GET</td>
            <td>Retrieve a single contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId</code></td>
            <td>PUT</td>
            <td>Update a single contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId</code></td>
            <td>DELETE</td>
            <td>Remove a single contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/phone_numbers</code></td>
            <td>GET</td>
            <td>Retrieve all phone numbers from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/phone_numbers</code></td>
            <td>POST</td>
            <td>Add a new phone number to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/phone_numbers/:phone</code></td>
            <td>GET</td>
            <td>Retrieve a single phone number from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/phone_numbers/:phone</code></td>
            <td>PUT</td>
            <td>Update a single phone number from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/phone_numbers/:phone</code></td>
            <td>DELETE</td>
            <td>Remove a single phone number from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/emails</code></td>
            <td>GET</td>
            <td>Retrieve all emails from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/emails</code></td>
            <td>POST</td>
            <td>Add a new email to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/emails/:email</code></td>
            <td>GET</td>
            <td>Retrieve a new email to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/emails/:email</code></td>
            <td>PUT</td>
            <td>Update a new email to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/emails/:email</code></td>
            <td>DELETE</td>
            <td>Remove a new email to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/addresses</code></td>
            <td>GET</td>
            <td>Retrieve all addresses from a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/addresses</code></td>
            <td>POST</td>
            <td>Add a new address to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/addresses/:addressId</code></td>
            <td>GET</td>
            <td>Retrieve a new address to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/addresses/:addressId</code></td>
            <td>PUT</td>
            <td>Update a new address to a contact</td>
          </tr>
          <tr>
            <td><code>/contacts/:contactId/addresses/:addressId</code></td>
            <td>DELETE</td>
            <td>Remove a new address to a contact</td>
          </tr>
          </tbody>
        </table>

        <h3>Technologies Used</h3>
        <ul>
          <li><a target="_blank" href="https://www.django-rest-framework.org/">Python - Django Rest Framework</a> - Web
            Framework
          </li>
          <li><a target="_blank" href="https://docs.pipenv.org/">Pipenv</a> - Python Development Workflow</li>
        </ul>

      </div>
    </div>
  </div>
</template>
