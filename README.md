# Vue Subscription Tracker

> A small web application to help track your subscriptions 

To start api server, run `node server/index.js`.
To start vue webpack server, run `npm run dev` from the client folder.

## TODOs
### Urgent

[] Fix dates going back a day on save 
- Save dates as ISO string in DB
- Dates are being parsed to local time in browser, need to only use no timezone
[] Need to fine tune inputs for sub form
- Check input types for phones
- Encode / Decode HTML
- style update button
- Add plus / minus buttons for interval (?)
- Form errors

### General

[] Mobile Responsiveness 
- Right menu needs a back button on mobile
[] Have upcoming payments on subscription forms for view only
[] Add sorting to payments; maybe layout like TickTick's side menu. E.g. All, Today, This Week, This Month
  [] For All, add accordion button 
[] Year and day parsing for future payments
[] No Subscription Found component
[] account page - full screen route
  [] settings page - integrate with account page
[] Handle removing error on lost focus for an error'd field's input
[] Integrate Tags
[x] custom color picker
[x] custom date picker
[x] Empty dashboard 
[x] Update subscriptions in dashboard main component when a subscription is updated
[x] reintegrate new subscription form
[x] Make a proxy for server? For easier deployment
[x] Delete subscription
[x] Color the subscriptions in the dashboard accordingly
[x] HTML escapes
[x] Price to decimal
[x] Polish dashboard look and feel
  [x] Work on right form menu

## Quick Links
- https://stackoverflow.com/questions/46389267/using-async-await-with-webpack-simple-configuration-throwing-error-regeneratorr
- https://vuejs.org/v2/cookbook/debugging-in-vscode.html