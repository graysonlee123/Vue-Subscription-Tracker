# vue-subscription-tracker

> A small web application to help track our subscriptions 

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# TODOs
[] Fix dates going back a day on save - maybe save in DB as Unix Timestamp
[] Year and day parsing for future payments
[] Add sorting to payments
[x] Delete subscription
[x] Color the subscriptions in the dashboard accordingly
[x] HTML escapes
[x] Price to decimal
[] Tags
[x] Polish dashboard look and feel
  [x] Work on right form menu
[] Handle removing error on lost focus for an error'd field's input
[] animations
[] custom color picker
[] custom date picker
[] left sidebar items
[] account page
[] settings page
[] prices aren't decimals anymore