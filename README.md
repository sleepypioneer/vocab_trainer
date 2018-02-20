# Vocabulary trainer App
##### ~ Improve your Vocab on the move ~
__this App is viewable at https://sleepypioneer.github.io/vocab_trainer/__
###### *Please note the github pages version does not have Database connectivity, please see below for installing with the database*

A offline accessible Progressive Web App for training German vocabulary on your mobile through flash cards.

###### *current version only viewable on Android Chrome*

#### User Stories:
  * Progressive Web App Manifest to allow user to add to home screen and view as native app.
  
  * A service worker makes the App Offline accessible
  
  * User can add thier own vocabulary and save these lists to the local storage (IndexedDB).
  
  * A user account can be saved to track the score count.
  
  * Vocabulary lists can be downloaded from the main DB and are then editable.
  
  * Currently user data is not pushed to the main Data base and is only saved locally.
  
  * A timer is inlcuded for timed sessions and goal setting.
  
  *Sound FX and styling choices (Night learning mode) can be changed on the account page.

**When viewed on larger screens the url points to this development page.


# Server

This App connects to a MySQL Data base using PHP, you can download the App and import the included MySQL Data Base file (vocab_trainer.sql) to view the App with it's full capability.

*Please note you will need to be able to run a Server and PHP for Windows I can reccomend XAMPP*
##### https://www.apachefriends.org/download.html
