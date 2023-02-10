# DAO-Example

It is simple example for DOA 

### Usercase

This is simple example of Governance based on both ERO20 and ERC721 you can used any of them and used this simple example

- [Hardhat Upgrades](#hardhat-upgrades)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quickstart](#quickstart)
  - [Typescript](#typescript)
    - [Optional Gitpod](#optional-gitpod)
- [Usage](#usage)
  - [Testing](#testing)
    - [Test Coverage](#test-coverage)
- [Deployment to a testnet or mainnet](#deployment-to-a-testnet-or-mainnet)
  - [Scripts](#scripts)
  - [Estimate gas](#estimate-gas)
    - [Estimate gas cost in USD](#estimate-gas-cost-in-usd)
  - [Verify on etherscan](#verify-on-etherscan)
- [Linting](#linting)
- [Formatting](#formatting)
- [Thank you!](#thank-you)

# Getting Started

## Deployed Contract Address
FigurePrintOracle = 0x30dc3146E8D2b07D26f0B7681DB200cdfFA56D28
OrcaleUrlProvider = 0xAb570B4B76f86b8678C33bCCc26f3cE6D51f3479

## Requirements

- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to install it with npm
- [Docker](https://docs.docker.com/get-docker/) if want to do Fazz testing `echidna`
  - You'll know you've installed docker right if you can run:
    - `docker --version` and get an output version.
  - or you can install with `Pythone` if you want

## Quickstart

```
git clone https://github.com/touqeerShah/DAO-EXAMPLE.git
cd DAO-EXAMPLE
yarn
```

# Usage

Start Node:
```
hh node
```

Open new terminal Deploy and run following command:
`following command will run the script which is used to create proposal for value change`

```
hh run scripts/prpose.ts --network localhost

```

It time to vote:
`following command will submit vote accrpt the proposal`

```
hh run scripts/vote.ts --network localhost

```

Once vote is executed it is time to put propoal in Queue:
`following command will submit Queue to wait to process time will finished `

```
hh run scripts/queue.ts --network localhost

```


Once propoal in Queue:
`following command  will impletment the changes and call the function to updated the values`

```
hh run scripts/queue.ts --network localhost

```


# Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981) or [Infura](https://www.infura.io/)

```
#### .evn
PRIVATE_KEY=
USER2_PRIVATE_KEY= <USER 2 Privete Key>
PROVIDER_REN_URL=https://goerli.infura.io/v3/<Infure Key>

ETHERSCANAPIKEY=<Ethetscan Key>
COINMARKETCAP_API_KEY= < Coin marketcap key>
```

2. Get testnet ETH

Head over to [Alchemy](https://goerlifaucet.com/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
yarn hardhat deploy --network goerli
```

## Staging Testing

After deploy to a testnet or local net, you can run staging test.

```
yarn run test:staging
```

## Estimate gas

You can estimate how much gas things cost by running:

```
yarn hardhat test
```

And you'll see and output file called `gas-report.txt`

### Estimate gas cost in USD

To get a USD estimation of gas cost, you'll need a `COINMARKETCAP_API_KEY` environment variable. You can get one for free from [CoinMarketCap](https://pro.coinmarketcap.com/signup).

Then, uncomment the line `coinmarketcap: COINMARKETCAP_API_KEY,` in `hardhat.config.js` to get the USD estimation. Just note, everytime you run your tests it will use an API call, so it might make sense to have using coinmarketcap disabled until you need it. You can disable it by just commenting the line back out.

## Verify on etherscan

If you deploy to a testnet or mainnet, you can verify it if you get an [API Key](https://etherscan.io/myapikey) from Etherscan and set it as an environemnt variable named `ETHERSCAN_API_KEY`. You can pop it into your `.env` file as seen in the `.env.example`.

In it's current state, if you have your api key set, it will auto verify goerli contracts!

However, you can manual verify with:

```
yarn hardhat verify --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS
```

Or when you Run you Deploy it will automatical verify the conteact when it was on testnet

# Linting

To check linting / code formatting:

```
yarn lint
```

or, to fix:

```
yarn lint:fix
```

Contract Address Testnet
```
on-chain goerli
{
    "TimeLock": "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    "GovernorContract": "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    "OrcaleUrlProvider": "0x04B0601D72dAEEA5D88D5d3B3495854FEe6cCf36",
    "FigurePrintOracle": "0x48c10b31964e158eAd1B50e15e77E344D56c2c77",
    "UserIdentityNFT": "0x8413e46843ac0ADF81d0b1889dCa1EF01a03e679",
    "DocumentSignature": "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    "LinkToken": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "MockOracle": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "PTNFT": "0x90aBdd9f7519eB46B3aCaf8FFB40d2364e67d4b2"
}
```

# Thank you!

[![Touqeer Medium](https://img.shields.io/badge/Medium-000000?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@touqeershah32)
[![Touqeer YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UC3oUDpfMOBefugPp4GADyUQ)
[![Touqeer Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/touqeer-shah/)
