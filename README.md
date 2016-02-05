## MyEtherWallet Chrome Extension / MyEtherWallet CX

### 2/4/2016: We have BETA LAUNCHED! You can now manually load this Chrome Extension and play with it. Instructions below.

### Why is it Beta? Am I safe?
Your data is *almost certainly* safe. We store all your data (nickname, wallet address, and private key) in [chrome.storage](https://developer.chrome.com/extensions/storage). This is the same place Chrome saves your passwords. The private key is encrypted. The majority of code comes directly from MyEtherWallet.com. However, we want more people to use it in unpredictable ways before we launch-launch.

- Please, DON'T forget to save your private key / password when you create a new wallet. Save them externally - not just on your computer! We wrote thorough instructions on the help page in the extension.
- Please DO make sure you are sending to the correct address.
- Please DO [reach out to us](https://www.myetherwallet.com/#contact) with any and all feedback you have, especially little bugs, things that confused you, or error messages that don't make sense / have typos.

MyEtherWallet.com and MyEtherWallet CX is not a "web wallet". You do not create an account or give us your Ether to hold onto. All data is saved on your computer, not our servers. It's not a website where you put your Ether and we store them for you. We just make it easy for you to save your wallet information in your browser/on your computer. Then we give you a place you to access that information and do stuff with it. I know it can be confusing, but when you look at the stuff in the Chrome Extension, you are NOT looking at stuff saved on our servers somewhere - it's all saved on your own computer.

### Adding to Chrome Manually

- Download the ZIP file using the button in the upper right.
- Unzip that file.
- Open up the folder that you just unzipped.
- Go to Google Chrome and find you settings (in the menu in the upper right).
- Click "extensions" on the left.
- Check the "developer mode" button at the top of that page.
- Click the "Load unpacked extension..." button.
- Navigate to the now-unzipped folder that you downloaded earlier.
- Click the "app" folder and then click "select".
- The extension should now show up in your extensions and in your Chrome Extension bar.

### Most "how to" questions are thoroughly answered on the help page, which can be viewed via the extension.

Read them. I spent way too much time writing and re-writing them. Let me know about the typos - I'm sure there are a few.

### The Basics

This is a companion project to [MyEtherWallet.com](https://www.myetherwallet.com) - an open source, javascript, client-side tool for generating Ether wallets. [github link](https://github.com/kvhnuke/etherwallet).

Both projects were created, and are maintained, by [kvhnuke](https://github.com/kvhnuke) and [tayvano](https://github.com/tayvano) aka [insomniasexx](https://www.reddit.com/user/insomniasexx).

### Purpose

The original purpose of MyEtherWallet.com was to provide a simple, user-friendly way for users to generate wallets, import pre-sale wallet files, and send transactions in a safe way. For the past 6 months, it has been used successfully (by more people than we ever imagined) to transfer Ether, print paper wallets, move funds from exchanges into cold storage, and more.

Our purpose has always been to give people the tools they need to participate in Ethereum without extensive command-line knowledge. We also want to avoid the issue with centralized web wallets, which are notorious for exit-scams, hacks, and massive losses. Your Ether and your information should stay with you...and you shouldn't have to be a technical wizard to do that.

The MyEtherWallet Chrome Extension (MyEtherWallet CX) allows you to:
- Import wallets & generate new wallets
- Save any number wallets in your browser
- Quickly & easily send transactions from these saved wallets

It essentially takes MyEtherWallet.com, takes away the need for you to upload your wallet file everytime you want to move your Ether, and still keeps your private keys and information with *you*.

### How it Works

First, you create a new wallet, upload an existing wallet file (presale, geth, myetherwallet), or paste your private key.

The password encrypts the private key for this wallet within the Chrome Extension. We recommend using a very strong password and keep it safe. You will need this password to send transactions and view your wallet details.

Lastly, add a nickname to your wallet. This is so you can easily differentiate between your wallets.

Your wallet is now stored in your browser. You can view it at any time and see the address, balance (in Ether, BTC, USD & EUR), and edit the nickname of the wallet.

One of the most exciting features happens directly from the Chrome Extension Icon. Here, you can initiate a QuickSend. We made this as short and easy as possible. We hope that this will inspire people to begin donating/tipping more in the Ethereum community, as we have seen with Bitcoin, Dogecoin, and the like.

QuickSend works like this:
- Select one of your saved wallets
- Enter an address you want to send Ether to
- Enter the amount to send
- Enter your password
- Confirm and send.

You can also use the traditional browser 'Send Transaction' interface found on MyEtherWallet.com, but instead of uploading / pasting you key, you simply select your wallet.

### Development
TODO. If you want to get involved, reach out to us.

### Contact
[View all the ways you can reach us here.](https://www.myetherwallet.com/#contact).
