# we got the owasp5 workshop before gta 6

## steps to reproduce
1. be me
2. profit

## how you can do it
1. create signup google form and a sheet where those responses are populated. i used google apps script to generate random passwords for each user upon their signing up (script [here](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/team-assignments.js))
2. create a google cloud account service worker with the proper scopes (google drive and sheets api iirc) and download account secret token json file once the account is created
3. adjust cells that the service worker is checking for in [this Jupyter Notebook](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/Guacamole%20REST%20API/Main.ipynb), which is being used to automate account creation on guacamole
   - side note: if you cloned this repo directly, you should probably clear guacamole container cache and all the user accounts or even better rebuild the container entirely!
4. change connection type, ip address, and port as needed. for this workshop, i used two kali virtual machine running xvncserver as a service, and I assigned them to two teams, depending on whose names were in which columns
5. make sure you running this on real hardware, else limit connection types and implement bandwidth saving measures. study the [guacamole rest api documentation](https://github.com/ridvanaltun/guacamole-rest-api-documentation/tree/master) for any clarifications. you could also just have the workshop be CLI only, which is completely fine. to do that, you just gotta thanos snap the desktop environment
6. now u gotta CREATE the users on the virtual machine, using the same Google Cloud service worker. Here's [a script](https://github.com/anishgoyal1108/OWASP5-Workshop/blob/main/user_initialization_script.py) i ran that will copy some files from root folder into each users desktop, add the users to /etc/passwd, make their readme world readable, assign them a password (that was randomly generated from google sheet), and add them to rdp group
7. profit

Even though this was created specifically for the OWASP5 workshop, you can (and probably should) use this for future workshops. apache guacamole is a great tool if you know how to use it. and if you keep the guacamole container alive, the only thing you would need to change between workshops is the connection parameters, making your work alot easier.

tl;dr: google form --> google sheet --> gcloud service worker parsing columns of both teams --> google apps scripts does the funnies (i have no idea how to read my own code but it basically generates passwords, divides ppl into teams, and emails ppl their login info) --> jupyter notebook generates guacamole logins and connection instances for their respective team's instance via vnc (you gotta run it manually) --> on both team instances you gotta run the scripts to generate the users.

### Google form
![image](https://github.com/anishgoyal1108/OWASP5-Workshop/assets/90469168/3fc58c49-814d-48c6-bd2b-535a93b7dadf)

### Generated logins sheet (dont be dumb, make sure the sheet is protected)
![image](https://github.com/anishgoyal1108/OWASP5-Workshop/assets/90469168/9064380a-b1ed-438c-ac08-d5ec767d1d87)

### Main sheet with buttons and generated teams
![image](https://github.com/anishgoyal1108/OWASP5-Workshop/assets/90469168/dbab564a-576e-4fb9-8a5d-5a99d1a94528)

### everything else
I cant be bothered to add screenshots, i believe in you!
