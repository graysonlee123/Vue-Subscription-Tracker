# Vue Subscription Tracker

> A small web application to help track your subscriptions and monthly expenses

To start api server, run `nodemon server`.
To start vue webpack server, run `npm run dev` from the client folder.

## TODOs
### Urgent

[] Refresh /dashboard/settings/account
[] Fix dates parsing to local time in browser
- [x] Saved dates as ISO string in DB no timezone offset
- [] Dates are being parsed to local timezone in browser, need to only use no timezone offset, look into moment "locale"

### General

[] Add avatar options menu in main menu, with logout, account settings, help / faq maybe
[] Maybe add a modals popup - for updating password, things like that
[] Add avatar uploading!!!
[] Handle removing error on lost focus for an error'd field's input
[] Date picker needs to show previous month and next month days - make look and interact more like ticktick's
[] Landing page - just serve in node
[] Sanitize user information on signup
[] Redirect logged in users away from login / register screen (? what's conventional ?)
[x] Logic for password change
[x] Logic for account deletion
[x] Errors when registering - userId was not being stored in jwt properly
[x] Look into making webapp only on /app, serve Home, About, Contact page on Node?
[x] Filters
[x] New design
[x] Need to fine tune inputs for sub form
-x Check input types for phones
-x Encode / Decode HTML
-x style update button
- Add plus / minus buttons for interval (?)
-x Form errors
[x] New color scheme for better legibility of white text
[x] Rotate arrow on Subscription component
[x] No Subscription Found component
[x] Add remove subscription logic to Subscription component dropdown
[x] Make subscription component fixed width
[x] Fix back arrow on mobile
[x] Fix new sub form's date default date
[x] Make a subscription "display" with an edit button to send to the subscription form
[x] Have upcoming payments on subscription forms for view only
[x] Mobile Responsiveness 
- Right menu needs a back button on mobile
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

### Icebox
[] Integrate Tags
[] Incorporate theme picker

## Quick Links
- https://stackoverflow.com/questions/46389267/using-async-await-with-webpack-simple-configuration-throwing-error-regeneratorr
- https://vuejs.org/v2/cookbook/debugging-in-vscode.html
- https://t.co/d4GPfuwRBd?amp=1
- http://colorsafe.co/