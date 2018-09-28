# EsecuBit wallet

# Introduction

This is the source code of the EsecuBit wallet chrome application, this application requires a EsecuBit hardware wallet and can be used for managing your crytocurrencies. You can use the application to create accounts, receive and send crytocurrencies with a EsecuBit hardware wallet.

You can also  build the application package yourself to use it without hardware for demonstration purposes.



## Main technology

vue2 + layui + webpack + ES6/7 + less + flex

## Development

Tips:This project used some properties such as ES6/7, so node 6.0.0+ is required.

```
git clone https://github.com/EsecuBit/EsecuBit-chrome-wallet.git

cd EsecuBit-chrome-wallet

# install dependencies
npm install

# serve at localhost:8080
npm run dev

# build for chrome app package
npm run build

```


# Layout

```
.
├── build                                       // webpack config file
├── chrome-config                               // chrome app config file
├── config                                      // package path
├── screenshots                                 // screenshot
├── src                                         // source directory
│   ├── common                                  // static common resource
│   │   ├── css                                 // css files
│   │   ├── fonts                               // fonts files
│   │   ├── imgs                                // image files
│   │   └── js                                  // js files
│   ├── components                              // main vue components
│   │   ├── index                               // index file include 4 components
│   │   │   ├── Accept.vue                      // Accept components
│   │   │   ├── Accounts.vue                    // Accounts components
│   │   │   ├── Send.vue                        // Send components
│   │   │   └── Setting.vue                     // Setting components
│   │   └── Login.vue                           // Login components
│   ├── App.vue                                 // App entry
│   └── main.js                                 // the main js for loading components and import sdk
├── .eslintignore                               // eslint ignore config
├── .eslintrc.js                                // eslint config file
├── .gitignore                                  // git ignore config
├── index.html                                  // entry page html file
├── package.json                                // package.json
.


```


# Screenshot

### init page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/init.bmp" width="600" height="350"/>

### sync page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/sync.bmp" width="600" height="350"/>

### accounts page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/accounts.bmp" width="600" height="350"/>

### send page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/send.bmp" width="600" height="350"/>

### receive page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/receive.bmp" width="600" height="350"/>

### setting page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/setting.bmp" width="600" height="350"/>


# App download Link

[https://www.esecubit.com/](https://www.esecubit.com/)


# Contact us

> If you need help, you can contact us.
> Email: support@esecubit.com


# License

[License](https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/LICENSE)
