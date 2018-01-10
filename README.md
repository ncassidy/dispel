
# Dispel
Dispel is an automated misinformation opposition application useful for calling attention to suspected bots and political demagogues found on Twitter.

### How to get the application running:
1. Install [node.js](https://nodejs.org/en/download/).
2. Clone the Dispel repository: `git clone https://github.com/ncassidy/dispel.git`
3. Open a command line interface and navigate to the repository root: `/dispel`.
4. Execute the following commands at the repository root.
```bash
npm install
```
5. Create a [Twitter Account](https://twitter.com/signup).
6. Create a [Twitter Application](https://apps.twitter.com/) under your account.
7. Within your created Twitter Application, click on the "Keys and Access Tokens" tab.
8. Write down the application's "Consumer Key (API Key)" and "Consumer Secret (API Secret)".
9. Scroll down and click the "Generate Access Token" button.
10. Write down the generated Token's "Access Token" and "Access Token Secret" keys.
11. Start the application.
```bash
npm start
```
12. Select the "Accounts" menu and "Add Account" using the information obtained to add an account.
13. Go back to the "Main Menu" and select the "Targets" menu.
14. Select "Add Targets" and add a suspected bot or political demagogue.
15. Go back to the "Main Menu" and select "Start Scanning".
