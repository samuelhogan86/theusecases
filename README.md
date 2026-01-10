#Medical Dashboard

With what we have right now you can get a test output going on localhost.

You need [Node.js](https://nodejs.org/en/download) installed locally.

Takes a little to finish. Once done, run the following:
```
node -v
npm -v
```
These will output a version number if you've done it right.

Afterward, run the following:
```
npm install
```
This will bring your theusecases/node_modules/ folder (*which you won't get from cloning the repo since node_modules/ is in our .gitignore*) up to date with express, mongodb, and whatever other dependencies we've chosen to use.

After this, we can start the server. Run the following:
```
node server.js
```
After this, the server should be running. Check in your browser.

http://localhost:3000 

It should display the contents of theusecases/public (*as of 10/2/25 this would just display "test"*)

Web App Project outline and actual use cases can be viewed [here](https://docs.google.com/document/d/12n-wbhgxbTd-zQcf2BppNiYwLAMOZbBj_MP1yKvByp8/edit?tab=t.0#heading=h.a8ke35vie2a8)
