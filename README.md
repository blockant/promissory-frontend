# Promissory-Frontend
Front End repository for promissory

#Metamask Integartion in Angular
https://medium.com/upstate-interactive/how-to-connect-an-angular-application-to-a-smart-contract-using-web3js-f83689fb6909


# PBC

## Local server
Run `npm install`
change directory to client and Run `npm install --force` and
Run `npm run build` in the folder base path and
Run `npm run start` to start the local server, Navigate to `http://localhost:5000/`

## Login with Super Admin
email:`sa@example.com`
password:`India@123` 
## Client Environment API Path for local to prod URL
go to client/src/environment/environment.ts change the ApiUrl `http://localhost:5000` to prod URL
Run `npm run build` in folder base path, dist will be generated with prod URL path
