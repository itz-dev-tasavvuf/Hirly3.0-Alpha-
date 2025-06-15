# Algorand Verification (TestNet)

This script allows you to verify users on Algorand TestNet using a central Pera wallet. It sends a self-transaction with a note containing the user identifier.

## Setup

1. Copy `.env.example` to `.env` and add your 25-word mnemonic for your Pera wallet.
2. Run `npm install` in this directory to install dependencies.
3. To verify a user, run:

```
node index.js user@example.com
```

This will send a transaction on TestNet with a note like `hirly-verify:user@example.com`.

## Security
- **Never commit your real .env file or mnemonic to version control.**
- Use only on TestNet for development.

## Customization
- You can change the note format or transaction logic as needed.
- Integrate this script into your backend API for production use.
