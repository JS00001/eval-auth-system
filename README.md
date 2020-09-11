# EvalAuth

## Introduction

> This is my take on a an eval auth system in node. It is not made to be used with any specific platform, but rather uses an api that any site, or bot, etc can make requests to to generate licenses, view requests etc.

> This is not really meant to be used, just putting here for applications or other items. However if anyone feels the need to use any of the code in this, please leave credit :)

## Files
> Main Folder 

**index.js** - This is the main file. It handles authentication requests along with API requests. All auth functions return an output of a clean json formatted message

**encrypt.js** - Encrypts the transferred data to be decrypted on client side. I use a seperate file because i thought it would be cleaner.

**config.json** - Edit basic configs for the auth. Very basic options. 

> Files folder

**anyfile.js** - Any product that you want to register to the auth. put it in this folder. (For now must be one file source) Then, you have the option to request those different files from the client side. 

> Data folder

**apikeys.json** - Stores all generated API keys (stores hashed so don't lose your keys)

**tokens.json** - Stores all generated tokens along with their hwid's. Each generated must have some sort of user identifier. Each users tokens will be stored in their object. 

> ClientSide folder

**config.json** - You can put all options you want configurable for your program in here, but keep the token spot. That is where users put their generated license key. 

**index.js** - Main file. (Obfuscate it) Put the url for your site in the **url** constant. Put the file name talked about above in the **fileName** constant. (dont include the .js, just the file name.)
