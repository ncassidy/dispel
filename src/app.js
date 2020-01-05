var JsonFile = require('jsonfile')
var Twitter = require('twitter');
var Chalk = require('chalk');


var _config;
var _blockedList;


var App = {
    startScan: function(Menu){
        App.setConfig();
        _blockedList = [];

        // Validate Config
        if(!App.isConfigReady()){
            console.log(Chalk.bgRed('\n[ ERROR: Accounts and Targets MUST be Configured - Returning to Main Menu! ]'));
            App.backToMenu(Menu);
            return;
        }

        var scanTask = setInterval(function(){
            if(_blockedList.length === _config.targets.length){
                clearInterval(scanTask);
                console.log(Chalk.bgRed('\n[ ERROR: All Accounts Blocked by Targets - Returning to Main Menu! ]'));
                App.backToMenu(Menu);
            }

            App.searchTargets();
        }, _config.settings.scanInterval * 1000);

        App.searchTargets();
    },

    setConfig: function(){
        _config = JsonFile.readFileSync(__dirname + '/config.json');

        // Clear Blocked Status
        for (var x = 0; x <_config.targets.length; x++) {
            delete _config.targets[x].is_blocked;
        }
    },

    isConfigReady: function(){
        return typeof _config !== 'undefined' && typeof _config.accounts !== 'undefined' && _config.accounts.length > 0 && typeof _config.targets !== 'undefined' && _config.targets.length > 0;
    },

    updateConfig: function(data){
        JsonFile.writeFileSync(__dirname + '/config.json', data, { spaces: 4 });
        _config = data;
    },

    searchTargets: function() {
        for(let x = 0; x < _config.targets.length; x++){
            if(!_config.targets[x].is_blocked){
                var connection = App.getConnetion(_config.targets[x]);
                App.getTweets(connection, _config.targets[x], x);
            }
        }
    },

    getConnetion: function(target){
        var accountIndex = target.account_index ? target.account_index : 0;

        return new Twitter(_config.accounts[accountIndex]);
    },

    getTweets: function(connection, target, targetIndex){
        // Set Search Params
        var params = {
            screen_name: target.screen_name,
            include_rts: false,
            exclude_replies: false,
            count: _config.settings.scanLimit
        };

        // Include since_id When Available
        if (target.since_id) {
            params.since_id = target.since_id;
        }

        // Attempt to Get Tweets
        console.log(Chalk.black.bgCyan(target.since_id ? '\n[ Searching: ' + Chalk.red.underline(params.screen_name) + ' - Since: ' + params.since_id + ' ]' : '\n[ Searching: ' + Chalk.red.underline(params.screen_name) + ' ]'));
        connection.get('statuses/user_timeline', params, function(err, tweets, response) {
            if (!err) {
                if (tweets && tweets.length && tweets.length > 0) {
                    // Reply to Each Tweet
                    for(let i = 0; i < tweets.length; i++){
                        App.reply(connection, target, tweets[i]);
                    }

                    // Update Last Tweet ID
                    App.setLastTweedId(targetIndex, tweets);
                } else {
                    console.log(Chalk.black.bgYellowBright('\n[ Searching: ' + Chalk.red.underline(params.screen_name) + ' - No New Tweets Available! ]'));
                }
            } else {
                App.handleError(err, targetIndex);
            }
        });
    },

    reply: function(connection, target, tweet){
        // Get Status
        var status = typeof status !== 'string' ? target.status[Math.floor(Math.random() * target.status.length)] : target.status;

        // Set Reply Params
        var params = {
            in_reply_to_status_id: tweet.id_str,
            status: status.replace(/TWITTER_NAME/g, tweet.user.name),
        };

        // Attempt to Reply
        console.log(Chalk.black.bgCyan('\n[ Replying to Tweet: ' + Chalk.red.underline(params.in_reply_to_status_id) + ' ]'));
        connection.post('statuses/update', params, function(err, data, response) {
            if (!err) {
                console.log(Chalk.black.bgCyan('\n[ Reply to Tweet: ' + Chalk.red.underline(params.in_reply_to_status_id) + ' - SUCCEEDED ]'));
            } else {
                App.handleError(err);
            }
        });
    },

    setLastTweedId: function(targetIndex, tweets){
        if (tweets[0] && tweets[0].id_str) {
            _config.targets[targetIndex].since_id = tweets[0].id_str;
        }

        App.updateConfig(_config);
    },

    updateRequestAccount: function(targetIndex){
        var currentAccountIndex = _config.targets && _config.targets[targetIndex] && _config.targets[targetIndex].account_index ? _config.targets[targetIndex].account_index : 0;
        var nextAccountIndex = currentAccountIndex + 1;

        // Update account_id or disable target
        if(_config.accounts && _config.accounts[nextAccountIndex]){
            _config.targets[targetIndex].account_index = nextAccountIndex;
        } else {
            delete _config.targets[targetIndex].account_index;
            _config.targets[targetIndex].is_blocked = true;
            console.log(Chalk.bgRed('\n[ ERROR: All Accounts Blocked for Target: ' + Chalk.cyan.underline(_config.targets[targetIndex].screen_name) + ' - Disabling Target! ]'));
            _blockedList.push(_config.targets[targetIndex].screen_name);
        }

        App.updateConfig(_config);
    },

    handleError: function(err, targetIndex){
        // Handel
        if(err[0] && err[0].code){
            switch(err[0].code) {
                // Expired Token
                case 89:
                    console.log(Chalk.bgRed('\n[ ERROR: Expired Token - Attempting request with another account! ]'));
                    App.updateRequestAccount(targetIndex);
                    break;

                // Authentication Failed
                case 32:
                    console.log(Chalk.bgRed('\n[ ERROR: Authentication Failed - Attempting request with another account! ]'));
                    App.updateRequestAccount(targetIndex);
                    break;

                // Blocked Account
                case 226:
                case 179:
                case 136:
                    console.log(Chalk.bgRed('\n[ ERROR: Account Blocked for Target: ' + Chalk.cyan.underline(_config.targets[targetIndex].screen_name) + ' - Attempting request with another account! ]'));
                    App.updateRequestAccount(targetIndex);
                    break;

                // Rate Limit Exceeded
                case 261:
                case 88:
                    console.log(Chalk.bgRed('\n[ ERROR: Rate Limit Exceeded - Attempting request with another account! ]'));
                    App.updateRequestAccount(targetIndex);
                    break;

                // Duplicate Tweet
                case 187:
                    console.log(Chalk.bgRed('\n[ ERROR: Duplicate Tweet - This target\'s tweet was already replied to! ]'));
                    break;

                // Invalid Attachment URL
                case 44:
                    console.log(Chalk.bgRed('\n[ ERROR: Invalid Attachment URL - The attachment URL is not vaid! ]'));
                    break;

                default:
                    // Unhandled Error Codes: https://developer.twitter.com/en/docs/basics/response-codes
                    console.log(Chalk.bgRed('\n[ ERROR: Unhandled Error - Code: ' + err[0].code  + ' ]'));
                    break;
            }
        }
    },

    getTargetsList: function(){
        App.setConfig();

        return _config.targets;
    },

    addTarget: function(target){
        App.setConfig();
        delete target.confirm;
        _config.targets.push(target)
        App.updateConfig(_config);
    },

    removeTarget: function(screen_name){
        App.setConfig();

        for(var x = 0; x < _config.targets.length; x++){
            if(_config.targets[x].screen_name === screen_name){
                _config.targets.splice(x, 1);
            }
        }

        App.updateConfig(_config);
    },

    getAccountsList: function(){
        App.setConfig();

        return _config.accounts;
    },

    addAccount: function(account){
        App.setConfig();
        delete account.confirm;
        _config.accounts.push(account)
        App.updateConfig(_config);
    },

    removeAccount: function(screen_name){
        App.setConfig();

        for(var x = 0; x < _config.accounts.length; x++){
            if(_config.accounts[x].screen_name === screen_name){
                _config.accounts.splice(x, 1);
            }
        }

        App.updateConfig(_config);
    },

    testAccount: function(account){
        var connection = account ? new Twitter(account) : new Twitter(_config.accounts[0]);
        var params = {
            include_rts: false,
            exclude_replies: false,
            count: 1
        };

        var testPromise = new Promise((resolve, reject )=> {
            connection.get('statuses/user_timeline', params, function(err, tweets, response) {
                var result = false;

                if (!err) {
                    result = true;
                }

                resolve(result);
            });
        });

        return testPromise;
    },

    setScanInterval: function(interval){
        App.setConfig();
        _config.settings.scanInterval = parseInt(interval);
        App.updateConfig(_config);
    },

    setScanLimit: function(limit){
        App.setConfig();
        _config.settings.scanLimit = parseInt(limit);
        App.updateConfig(_config);
    },

    backToMenu: function(Menu){
        setTimeout(function(){
            Menu.renderMainMenu();
        }, 5000);
    }
};


module.exports = App;