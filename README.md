# we got the owasp5 workshop before gta 6

## steps to reproduce
1. be me
2. profit

## how you can do it
1. create signup google form and a sheet where those responses are populated. i used google apps script to generate random passwords for each user upon their signing up.
2. create a google cloud account service worker and pass it into aaccount secret token json file
3. adjust cells that the service worker is checking for, since its automating account creation in guacamole
   - You should probably clear guacamole cache and all the user accounts or even better rebuild the container entirely!
4. change connection type, ip address, and port as needed. for most workshops, i used two kali virtual machine running xvncserver as a service
5. make sure you running this on real hardware, else limit connection types and implement bandwidth saving measures. study the [guacamole rest api documentation](https://github.com/ridvanaltun/guacamole-rest-api-documentation/tree/master) for any clarifications. you could also just have the workshop be CLI only, which is completely fine. to do that, you just gotta thanos snap the desktop environment
6. now u gotta CREATE the users on the virtual machine, using the same Google Cloud service worker. Here's a script i ran that will copy some files from root folder into each users desktop, add the users to /etc/passwd, make their readme world readable, assign them a password (that was randomly generated from google sheet), and add them to rdp group
7. profit

Even though this was created specifically for the OWASP5 workshop, you can (and probably should) use this for future workshops. apache guacamole is a great tool if you know how to use it. and if you keep the guacamole container alive, the only thing you would need to change between workshops is the connection parameters, making your work alot easier.
