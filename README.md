# NEMO OData Express

A lightweight app to serve a static OData feed for testing. Provides necessary response types and custom headers such as `OData-Version` so that programs like Power BI don't complain.

## Development

### Requirements

1. Node.js

### Usage

1. `npm install`
1. `npm start` (automatically watches for changes)
1. Visit <http://localhost:3000/odata/v1>

### Updating the data

Edit the files under routes/ and view the changes in your browser.
