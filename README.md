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
[x] Empty dashboard 
[x] Update subscriptions in dashboard main component when a subscription is updated
[x] reintegrate new subscription form
[] Make a proxy for server? For easier deployment
[] Fix dates going back a day on save - maybe save in DB as Unix Timestamp and parse on front-end
[] Year and day parsing for future payments
[] Add sorting to payments; maybe layout like TickTick's side menu. E.g. All, Today, This Week, This Month
  [] For All, add accordion button 
[] No Subscription Found item
[] account page - full screen route
  [] settings page - integrate with account page
[] Handle removing error on lost focus for an error'd field's input
[] custom color picker
[] custom date picker
[] Tags
[x] Delete subscription
[x] Color the subscriptions in the dashboard accordingly
[x] HTML escapes
[x] Price to decimal
[x] Polish dashboard look and feel
  [x] Work on right form menu