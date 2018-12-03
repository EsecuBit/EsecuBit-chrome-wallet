# Esecubit wallet

# Introduction

This is the source code of the EsecuBit wallet chrome application, this application requires a EsecuBit hardware wallet and can be used for managing your crytocurrencies. You can use the application to create accounts, receive and send crytocurrencies with a EsecuBit hardware wallet.

You can also  build the application package yourself to use it without hardware for demonstration purposes.



## Main technology

vue2 + vuex + vue-i18n + layui + webpack + ES6/7 + less + flex

## Development


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
├── screenshots                                 // screenshots
├── src                                         // source directory
│   ├── common                                  // static common resource
│   │   ├── css                                 // css files
│   │   ├── fonts                               // fonts files
│   │   ├── imgs                                // image files
│   │   └── js                                  // js files
│   ├── components                              // main vue components
│   │   ├── breadcrumb                          // breadcrumb component
│   │   ├── content                             // content component
│   │   ├── eos                                 // includes eos components
│   │   │   ├── accounts                        // eos accounts components
│   │   │   ├── resource                        // eos resource components
│   │   │   ├── transaction                     // eos transaction components
│   │   │   └── vote                            // eos vote components
│   │   ├── content                             // content component
│   │   ├── header                              // header component
│   │   ├── login                               // login page
│   │   └── pages
│   │       ├── accept                          // btc and eth Accept components
│   │       ├── accounts                        // btc and eth Accounts components
│   │       ├── send                            // btc and eth Send components
│   │       └── setting                         // btc and eth Setting components
│   ├── store                                   // vuex Plugin
│   │     ├── actions                           // actions
│   │     ├── getters                           // getters
│   │     ├── index                             // index
│   │     └── mutations                         // mutations
│   ├── utils                                   // utils package
│   ├── App.vue                                 // App entry
│   └── main.js                                 // the main js for loading components and import sdk
├──  static                                     // static resource
├── .eslintignore                               // eslint ignore config
├── .eslintrc.js                                // eslint config file
├── .gitignore                                  // git ignore config
├── index.html                                  // entry page html file
├── package.json                                // package.json
.


```


# Screenshot

### accounts page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/accounts.png" width="600" height="350"/>

### send page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/send.png" width="600" height="350"/>

### receive page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/receive.png" width="600" height="350"/>

### setting page

<img src="https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/screenshots/setting.png" width="600" height="350"/>


# App download Link

[https://www.esecubit.com/](https://www.esecubit.com/)


# Contact us

> If you need help, you can contact us.
> Email: support@esecubit.com


# License

[LGPL-3.0 ](https://github.com/EsecuBit/EsecuBit-chrome-wallet/blob/master/LICENSE)
