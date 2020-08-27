# Vue Subscription Tracker

> A small web application to help track your subscriptions and monthly expenses

To start api server, run `nodemon server`.
To start vue webpack server, run `npm run dev` from the client folder.

## TODOs
### Priority

[] Instead of posting a new subscription on duplication, fill out a blank form

### General

[] Landing page - just serve in node and link correspondingly?
[] Restrict IP's from Mongo Database
[] Blank subscription
[] Double check new user avatar

### Low Priority
[] Mobile responsiveness for subscriptions list, specifically on tablet
[] "Flash" subscription on update / creation in list
[] fix "onblur" remove errors for input components

### Done

[x] Add, for example, "in two months" to upcoming payment dates
[x] Loading spinners
[x] Set input type to email for auth forms for mobile phone keyboards
[x] Scrolling on forms
[x] Photo uploads file size increase
[x] Buttons on list header still not on their own line
[x] Limit sort options to name, price, next payment on mobile
[x] Add "update description" and "remove subscription" actions to a mixin
[x] Add options menu to view subscription component
[x] Show more than one upcoming payment date
[x] Add view subscription page
[x] Toggle sort direction on mobile
[x] Mobile responsiveness for subscriptions list header
[x] Make sort methods work on the labels for desktop
[x] X button on subscription form for mobile
[x] Clicking off of menus
[x] Handle removing error on blur for an error'd field's input
[x] add random string before avatar file names
[x] style 404 page
[x] Make subscriptions scroll independently of page
[x] favicon / logo
[x] Remove placeholder tags
[x] Hide view button and far right options button
[x] Avatar uploading bar and general better ui
[x] Restrict avatars to jpg and png
[x] Handle new user avatars
- CORS Policy blocking new user avatar for picture input
- Heroku is ephemeral (deletes everything and starts fresh each dyno); need to look into Firebase
[x] Vertical align arrow on modals
[x] Look into removing vue-moment dependency
[x] Sanitize user information on signup
- Capitalize first letter in names
[x] Empty subscriptions ? "add new subscription" list item
[x] Add avatar photo uploading!
- [x] Maybe link default avatars to https://via.placeholder.com/200/8369fe/eeebff?text=${firstInitial}${lastInitial}
- [x] Save link to user's avatar as a link in the database and load into store with initial user load
- See https://www.digitalocean.com/community/tutorials/vuejs-uploading-vue-picture-input
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
  [] filter by tag, payment method
[] Incorporate theme picker
[] Add "zoom out" month picker for date picker component
[] Email reminders

## Quick Links
- Component Input Fields https://bangjelkoski.com/blog/building-a-controlled-vue-input/
- Deployment https://medium.com/netscape/deploying-a-vue-js-2-x-app-to-heroku-in-5-steps-tutorial-a69845ace489
- https://stackoverflow.com/questions/46389267/using-async-await-with-webpack-simple-configuration-throwing-error-regeneratorr
- https://vuejs.org/v2/cookbook/debugging-in-vscode.html
- https://t.co/d4GPfuwRBd?amp=1
- http://colorsafe.co/