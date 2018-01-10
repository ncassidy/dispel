var App = require('./app.js');
var Clear = require('clear');
var Inquirer = require('inquirer');
var Chalk = require('chalk');


const _options = {
    scan: 'Start Scanning',
    targets: 'Targets',
    accounts: 'Accounts',
    settings: "Settings",

    add_target: 'Add Target',
    remove_target: 'Remove Target',

    add_account: 'Add Account',
    remove_account: 'Remove Account',
    test_account: 'Test Account',

    interval_setting: 'Update Interval',
    limit_setting: 'Update Limit',

    exit: 'Exit',
    return: 'Return'
};


var Menu = {
    renderMainMenu: function() {
        Menu.menuReset();

        var mainMenu = [
            {
                type: 'list',
                name: 'main_menu',
                prefix: '',
                message: 'MAIN MENU:',
                choices: [_options.scan, _options.targets, _options.accounts, _options.settings, new Inquirer.Separator(), _options.exit]
              }
        ];

        Inquirer.prompt(mainMenu).then(response => {
            switch(response.main_menu) {
                // Begin Scanning
                case _options.scan:
                    App.startScan(Menu);
                    break;

                // Modify Targets
                case _options.targets:
                    Menu.renderTargetsMenu();
                    break;

                // Modify Accounts
                case _options.accounts:
                    Menu.renderAccountsMenu();
                    break;

                // Modify Settings
                case _options.settings:
                    Menu.renderSettingsMenu();
                    break;
                    
                // Exit
                case _options.exit:
                    Clear(true);
                    process.exit();
                    break;
            }
        });
    },

    renderTargetsMenu: function(){
        Menu.menuReset();

        var targetsMenu = [
            {
                type: 'list',
                name: 'targets_menu',
                prefix: '',
                message: 'Targets Menu:',
                choices: [_options.add_target, _options.remove_target, new Inquirer.Separator(), _options.return]
              }
        ];

        Inquirer.prompt(targetsMenu).then(response => {
            switch(response.targets_menu) {
                // Add Target
                case _options.add_target:
                    Menu.renderAddTargetMenu();
                    break;

                // Remove Target
                case _options.remove_target:
                    Menu.renderRemoveTargetMenu();
                    break;
                
                // Return
                case _options.return:
                    Menu.renderMainMenu();
                    break;     
            }
        });
    },

    renderAddTargetMenu: function(){
        Menu.menuReset();
        var targetsList = App.getTargetsList();

        var addTargetMenu = [ 
            {
                type: 'input',
                name: 'screen_name',
                message: "What is the target's screen name (e.g. @Misinformed32)?",
                prefix: '',
                validate: function(val) {
                    // Valid Characters
                    if (!val.match(/@+[a-zA-Z0-9]/)) {
                        return 'Please enter a valid screen name!';
                    }
                    
                    // No Already Added
                    for(var x = 0; x < targetsList.length; x++){
                        if(targetsList[x].screen_name == val){
                            return 'This screen name is already a target!'
                        }
                    }
                
                    return true;
                }
            },
            {
                type: 'input',
                name: 'status',
                message: "What would you like to reply to the target (260 char max)?",
                prefix: '',
                validate: function(val) {
                    // Valid Characters
                    if (!val.match(/[a-zA-Z0-9@]/)) {
                        return 'Please enter a valid reply!';
                    }

                    // Valid Length
                    if (val.length >= 260) {
                        return 'Please enter a replay that is under 260 characters!';
                    }
                
                    return true;
                }
            },
            { 
                type: 'confirm',
                name: 'confirm',
                message: "Are you sure that you want to add this target?",
                prefix: '',
            }
        ];

        Inquirer.prompt(addTargetMenu).then(response => {
            if(response.confirm) {
                App.addTarget(response);
            }

            Menu.renderTargetsMenu();
        });
    },

    renderRemoveTargetMenu: function(){
        Menu.menuReset();
        var targetsList = App.getTargetsList();
        var choices = targetsList.map(choice => (choice.screen_name));

        var removeTargetMenu = [ 
            {
                type: 'list',
                name: 'target',
                prefix: '',
                message: 'Which target would you like to remove?',
                choices: choices
            }, 
            { 
                type: 'confirm',
                name: 'confirm',
                message: "Are you sure that you want to remove this target?",
                prefix: '',
            }
        ];

        Inquirer.prompt(removeTargetMenu).then(response => {
            if(response.confirm) {
                App.removeTarget(response.target);
            }

            Menu.renderTargetsMenu();
        });
    },

    renderAccountsMenu: function(){
        Menu.menuReset();

        var accountsMenu = [
            {
                type: 'list',
                name: 'accounts_menu',
                prefix: '',
                message: 'Accounts Menu:',
                choices: [_options.add_account, _options.remove_account, _options.test_account, new Inquirer.Separator(), _options.return]
              }
        ];

        Inquirer.prompt(accountsMenu).then(response => {
            switch(response.accounts_menu) {
                // Add Account
                case _options.add_account:
                    Menu.renderAddAccountMenu();
                    break;

                // Remove Account
                case _options.remove_account:
                    Menu.renderRemoveAccountMenu();
                    break;

                // Test Account
                case _options.test_account:
                    Menu.renderTestAccountMenu();
                    break;    
                
                // Return
                case _options.return:
                    Menu.renderMainMenu();
                    break;     
            }
        });
    },

    renderAddAccountMenu: function(){
        Menu.menuReset();
        var accountList = App.getAccountsList();

        var addAccountMenu = [ 
            {
                type: 'input',
                name: 'screen_name',
                message: "What is the account's screen name (e.g. @Misinformed32)?",
                prefix: '',
                validate: function(val) {
                    // Valid Characters
                    if (!val.match(/@+[a-zA-Z0-9]/)) {
                        return 'Please enter a valid screen name!';
                    }
                    
                    // No Already Added
                    for(var x = 0; x < accountList.length; x++){
                        if(accountList[x].screen_name == val){
                            return 'This account is already included!'
                        }
                    }
                
                    return true;
                }
            },
            {
                type: 'input',
                name: 'consumer_key',
                message: "What is the account's consumer key?",
                prefix: ''
            },
            {
                type: 'input',
                name: 'consumer_secret',
                message: "What is the account's consumer secret?",
                prefix: ''
            },
            {
                type: 'input',
                name: 'access_token_key',
                message: "What is the account's access token key?",
                prefix: ''
            },
            {
                type: 'input',
                name: 'access_token_secret',
                message: "What is the account's access token secret?",
                prefix: ''
            },
            { 
                type: 'confirm',
                name: 'confirm',
                message: "Are you sure that you want to add this account?",
                prefix: ''
            }
        ];

        Inquirer.prompt(addAccountMenu).then(response => {
            if(response.confirm) {
                App.addAccount(response);
            }

            Menu.renderAccountsMenu();
        });
    },

    renderRemoveAccountMenu: function(){
        Menu.menuReset();
        var accountsList = App.getAccountsList();
        var choices = accountsList.map(choice => (choice.screen_name));

        var removeAccountMenu = [ 
            {
                type: 'list',
                name: 'account',
                prefix: '',
                message: 'Which account would you like to remove?',
                choices: choices
            }, 
            { 
                type: 'confirm',
                name: 'confirm',
                prefix: '',
                message: "Are you sure that you want to remove this account?",
            }
        ];

        Inquirer.prompt(removeAccountMenu).then(response => {
            if(response.confirm) {
                App.removeAccount(response.account);
            }

            Menu.renderAccountsMenu();
        });
    },

    renderTestAccountMenu: function(){
        Menu.menuReset();
        var accountsList = App.getAccountsList();
        var choices = accountsList.map(choice => (choice.screen_name));

        var testAccountMenu = [ 
            {
                type: 'list',
                name: 'screen_name',
                prefix: '',
                message: 'Which account would you like to test?',
                choices: choices
            }
        ];

        Inquirer.prompt(testAccountMenu).then(response => {
            Menu.menuReset();

            // Get Account
            var account;
            for(var x = 0; x < accountsList.length; x++) {
                if(accountsList[x].screen_name === response.screen_name){
                    account = accountsList[x];
                }
            }

            // Test Account and Respond
            App.testAccount(account).then(function(isWorking){
                var testAccountResponseMenu = [{
                    type: 'list',
                    name: 'reply',
                    prefix: '',
                    message: isWorking ? 'Account Test - SUCCEEDED!' : 'Account Test - FAILED!',
                    choices: [ new Inquirer.Separator(), _options.return ]
                }];
                Inquirer.prompt(testAccountResponseMenu).then(response => {
                    switch(response.reply) {  
                        // Return
                        case _options.return:
                            Menu.renderAccountsMenu();
                            break;     
                    }
                });
            });
        });
    },

    renderSettingsMenu: function(){
        Menu.menuReset();

        var settingsMenu = [
            {
                type: 'list',
                name: 'settings_menu',
                prefix: '',
                message: 'Settings Menu:',
                choices: [_options.interval_setting, _options.limit_setting, new Inquirer.Separator(), _options.return]
              }
        ];

        Inquirer.prompt(settingsMenu).then(response => {
            switch(response.settings_menu) {
                // Edit Interval
                case _options.interval_setting:
                    var intervalQuestions = [            {
                            type: 'input',
                            name: 'scanInterval',
                            message: "How many seconds between target scans would you like to wait (Default: 10 seconds)?",
                            prefix: '',
                            default: function() {
                                return 10;
                            },
                            validate: function(val) {
                                // Valid Characters
                                if (!val.match(/[0-9]/) || !(val > 0)) {
                                    return 'Please enter a valid scan interval!';
                                }
                            
                                return true;
                            }
                        },
                        { 
                            type: 'confirm',
                            name: 'confirm',
                            prefix: '',
                            message: "Are you sure that you want to update the scan interval?",
                        }
                    ];

                    Inquirer.prompt(intervalQuestions).then(response => {
                        if(response.confirm){
                            App.setScanInterval(response.scanInterval);
                        }
                        Menu.renderSettingsMenu();
                    });
                    break;

                // Edit Limit
                case _options.limit_setting:
                    var limitQuestions = [            {
                            type: 'input',
                            name: 'scanLimit',
                            message: "How many tweets would you like to reply to per target scan (Default: 5 tweets)?",
                            prefix: '',
                            default: function() {
                                return 5;
                            },
                            validate: function(val) {
                                // Valid Characters
                                if (!val.match(/[0-9]/) || !(val > 0)) {
                                    return 'Please enter a valid scan limit!';
                                }
                            
                                return true;
                            }
                        },
                        { 
                            type: 'confirm',
                            name: 'confirm',
                            prefix: '',
                            message: "Are you sure that you want to update the scan limit?",
                        }
                    ];

                    Inquirer.prompt(limitQuestions).then(response => {
                        if(response.confirm){
                            App.setScanLimit(response.scanLimit);
                        }
                        Menu.renderSettingsMenu();
                    });
                    break;
                
                // Return
                case _options.return:
                    Menu.renderMainMenu();
                    break;     
            }
        });
    },

    menuReset: function(){
        Clear(true);
        console.log('[DISPEL]');
    }
};

module.exports = Menu;