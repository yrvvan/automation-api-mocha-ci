# mocha-automation-api

### Prerequisites:

- Install Node.js and npm

### How to Getting Started:

```sh
$ npm install
```

### This is directory structure

        .
        ├── data
        │  ├── fixtures
        │  ├── schema
        ├── page
        ├── reports
        │  └── mochawesome
        ├── test
        ├── .env
        └── package.json

### Foldering and Naming Convention

1. Filename using `snake_case` *except for the repo name*
2. Variable name using `camelCase`
3. Add your http request file (`_page.js`) into `/page` folder
4. Add your test file (`_test.js`) into `/test` folder
5. Add your data test file (`_data.js`) into `/data/fixtures` folder
6. Add your response schema file (`_schema.js`) into `/data/schema` folder
7. Declare value in `.env` variables
8. Your result report will be added in to `/reports/mochawesome`

## Run the test

You can specify the command that you want to run from package.json file.

###### Here are our default commands:

```sh
$ npm run test
```