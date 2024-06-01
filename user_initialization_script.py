# Run this script on each container you will be using for the workshop!
# Remember, you must run this script within the CONTAINERS! Plz dont run this on your own machine
# Also, it uses the same service account secret so make sure the json file is available too

import gspread
import os
from oauth2client.service_account import ServiceAccountCredentials

# Define the scope and credentials
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = ServiceAccountCredentials.from_json_keyfile_name('service_account_secret.json', scope)

# Authorize the client
client = gspread.authorize(creds)

# Open the Google Sheet by its ID
sheet = client.open_by_key('127tfOUFWpw5MMWCanvuNBexCkUhFnshiWSMvn3F3N1c')
worksheet = sheet.worksheet('Logins')

# Get all values from columns A/B and C/D
usernames = worksheet.col_values(3)
passwords = worksheet.col_values(4)

# Create key-value pairs
login_info = dict(zip(usernames[:], passwords[:]))

for username, password in login_info.items():
    # create user with given password
    os.system(f'useradd -s /usr/bin/zsh -m -p $(openssl passwd -1 {password}) {username}')
    # create desktop directory
    os.system(f'mkdir /home/{username}/Desktop')
    # copy all files from root desktop to user's desktop
    os.system(f'cp -r /root/Desktop/* /home/{username}/Desktop/')
    # make the file world-readable
    os.system(f'chmod 777 /home/{username}/Desktop/README')
    # add user to group rdp
    os.system(f'usermod -a -G rdp {username}')
