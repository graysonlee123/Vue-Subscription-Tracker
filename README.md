# Vue Subscription Tracker

> A small web application to help track your subscriptions and monthly expenses

To start api server, run `nodemon server`.
To start vue webpack server, run `npm run dev` from the client folder.

## TODOs
### Priority

[] Add avatar photo uploading!
- [x] Maybe link default avatars to https://via.placeholder.com/200/8369fe/eeebff?text=${firstInitial}${lastInitial}
- [] Save link to user's avatar as a link in the database and load into store with initial user load
- https://www.digitalocean.com/community/tutorials/vuejs-uploading-vue-picture-input

### General

[] Handle removing error on lost focus for an error'd field's input
[] Sanitize user information on signup
- Capitalize first letter in names
[] Clicking off of menus
[] "Flash" subscription on update / creation in list
[] Landing page - just serve in node and link correspondingly
[] Look into removing vue-moment dependency
[] Empty subscriptions ? "add new subscription" list item
[x] Login and Register form front-end feedback
[x] "Add new" button in nav
[x] Date picker needs to show previous month and next month days - make look and interact more like ticktick's
[x] Fix nav menu highlights
[x] Redirect logged in users away from login / register screen (? what's conventional ?)
- Looks like check if logged in on login page and redirect if so
[x] Fix dates parsing to local time in browser
- [x] Saved dates as ISO string in DB no timezone offset
- [x] Dates are being parsed to local timezone in browser, need to only use no timezone offset https://momentjs.com/docs/#/parsing/utc/
[x] Add avatar options menu in main menu, with logout, account settings, help / faq maybe
[x] Refresh /dashboard/settings/account
[x] Maybe add a modals popup - for updating password, things like that
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
[] Add "zoom out" month picker for date picker component

## Quick Links
- https://stackoverflow.com/questions/46389267/using-async-await-with-webpack-simple-configuration-throwing-error-regeneratorr
- https://vuejs.org/v2/cookbook/debugging-in-vscode.html
- https://t.co/d4GPfuwRBd?amp=1
- http://colorsafe.co/