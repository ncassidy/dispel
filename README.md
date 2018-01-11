

# Nyet
Nyet is an automated misinformation opposition bot application useful for calling attention to suspected Russian bots found on Twitter. Nyet phonetically means "no" in Russian.

## How to get Nyet up and running:
1. Download and install [node.js](https://nodejs.org/en/download/).
2. Download the Nyet [application](https://github.com/ncassidy/nyet) or Clone the Nyet repository directly: `git clone https://github.com/ncassidy/nyet.git`
3. Open a command line interface and navigate to your local repository root directory: `/nyet`.
4. Execute the following commands within your command line interface at the repository root.
```bash
npm install
npm start
```

## How to setup one or more accounts:

1. Create a [Twitter Account](https://twitter.com/signup).
2. Create a [Twitter Application](https://apps.twitter.com/) under your account.
3. Within your created Twitter Application, click on the "Keys and Access Tokens" tab.
4. Write down the application's "Consumer Key (API Key)" and "Consumer Secret (API Secret)".
5. Scroll down and click the "Generate Access Token" button.
6. Write down the generated Token's "Access Token" and "Access Token Secret" keys.
7. Start the Nyet application.
```bash
npm start
```
8. From the "Main Menu", select the "Accounts" menu item and "Add Account" using the information obtained above.


## How to setup one or more suspected Russian bot targets:
1. Find a Russian Twitter bot that is actively participating on Twitter. Be sure to write their Twitter handle down.
2. Start the Nyet application.
```bash
npm start
``` 
3. From the "Main Menu", select the "Targets" menu item and "Add Target" using the Twitter handle obtained above.


## How to begin automate scanning and replies to suspected Russian bots:
1. Start the Nyet application.
```bash
npm start
``` 
2. Once you've added one or more valid accounts and targets, from the "Main Menu", select the "Start Scanning" option.


## Defaults:
- Nyet scans all targets on a 20 second interval. This can be changed by selecting the "Update Scan Interval" option from the "Settings" menu item.
- Nyet replys to the most recent 5 Tweets of each target - since the last replied to Tweet. This limit count can be changed by selecting the "Update Scan Reply Limit" option from the "Settings" menu item.