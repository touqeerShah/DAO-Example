# DAO-Example

In this repo we try to execute example of ERC 1155 stand NFT creation, which allow us to create multiple NFT in single place which are easy to manage.

### Usercase

We use simple application in which we create crops some of them are common or some of them are unique.

- First we Mint NFT at crops contract.
- Then we move those crop for sale to the Farm contract on which other user can buy those NFT.
- we have our own DAI ERC20 token which we issue to the user so they can put there money on stack and get some point which are used to buy NFT's.
- It simple case of like game where you have some component which game offer based on point user own, once you put user coin on stack based on you time how long you put you money on stack Farm contract award you some Point which you can claim by buy NFT's from farm.

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
git clone https://github.com/touqeerShah/NFT-ERC-1155.git
cd NFT-ERC-1155
yarn
```

# Usage

Deploy:

```
yarn run deploy
```

## Testing

```
yarn run test
```

### Test Coverage

```
yarn run coverage
```

### Fuzz Testing

- Run eth-security-toolbox with docker

```
docker run -it --rm  -v $PWD:/code/  trailofbits/eth-security-toolbox
```

- Once Toolbox is running then

```
yarn run echidna
```

```
Output:
echidna-test . --test-mode assertion --contract FarmTest   --config echidna.config.yml
Analyzing contract: /code/contracts/test/FarmeTest.sol:FarmTest
crops():  passed! 🎉
farm():  passed! 🎉
claimNFTs(uint256[],uint256[]):  passed! 🎉
addNFTs(uint256[],uint256[],uint256[]):  passed! 🎉
stakeTokens(uint256):  passed! 🎉
unstakeTokens():  passed! 🎉
token():  passed! 🎉
AssertionFailed(..):  passed! 🎉
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

# Thank you!

[![Touqeer Medium](https://img.shields.io/badge/Medium-000000?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@touqeershah32)
[![Touqeer YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UC3oUDpfMOBefugPp4GADyUQ)
[![Touqeer Linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/touqeer-shah/)
