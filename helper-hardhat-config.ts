
export interface networkConfigItem {
    ethUsdPriceFeed?: string
    blockConfirmations?: number
    linkToken?: string
    oricle?: string
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
    localhost: {},
    hardhat: {},
    goerli: {
        blockConfirmations: 6,
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        oricle: "0xCC79157eb46F5624204f47AB42b3906cAA40eaB7",
    },
}


export const developmentChains = ["hardhat", "localhost"]
export const proposalsFile = "proposals.json"
export const contractAddressFile = "config/contractAddress.json"

// Governor Values
export const QUORUM_PERCENTAGE = 4 // Need 4% of voters to pass
export const MIN_DELAY = 3600 // 1 hour - after a vote passes, you have 1 hour before you can enact
// export const VOTING_PERIOD = 45818 // 1 week - how long the vote lasts. This is pretty long even for local tests
export const VOTING_PERIOD = 5 // blocks
export const VOTING_DELAY = 1 // 1 Block - How many blocks till a proposal vote becomes active
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

export const NEW_STORE_VALUE = 77
export const FUNC = "setUrl"
export const PROPOSAL_DESCRIPTION = "Proposal #1 77 in the Box!"
export const ORCALE_URL_PROVIDER = process.env.OrcaleUrlProvider || "";
export const JOB_ID = "7d80a6386ef543a3abb52817f6707e3b"
export const SIGNING_DOMAIN_NAME = "User-Identity"
export const SIGNING_DOMAIN_VERSION = "1"
export const NFT_NAME = "User-Identity"
export const NFT_SYMBOL = "786"

export const DS_SIGNING_DOMAIN_NAME = "Doc-Sign"
export const DS_SIGNING_DOMAIN_VERSION = "1"
export const DS_NFT_NAME = "Doc-Sign"
export const DS_NFT_SYMBOL = "DS_786"
