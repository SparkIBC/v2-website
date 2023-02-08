import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate'
import { WalletData } from './wallet'
import { FundingClient, FundingQueryClient } from 'types/Funding.client'

const getCosmWasmClientImport = import('./cosmwasm/getCosmWasmClient')

export interface SparkClientContructor {
  wallet: WalletData | null
  fundingContract: string
  signingCosmWasmClient: SigningCosmWasmClient | null
}

export class SparkClient {
  private _cosmWasmClient: CosmWasmClient | null = null
  public signingCosmWasmClient: SigningCosmWasmClient | null = null

  private _fundingClient: FundingQueryClient | null = null

  public fundingContract: string

  private _wallet: WalletData | null = null

  constructor({
    wallet,
    fundingContract,
    signingCosmWasmClient,
  }: SparkClientContructor) {
    this._wallet = wallet
    this.fundingContract = fundingContract
    this.signingCosmWasmClient = signingCosmWasmClient
  }

  public async connect() {
    if (this._cosmWasmClient) {
      return
    }

    const getCosmWasmClient = (await getCosmWasmClientImport).default
    // create cosmwasm client
    this._cosmWasmClient = await getCosmWasmClient(process.env.NEXT_PUBLIC_RPC!)

    this._fundingClient = new FundingQueryClient(
      this.cosmWasmClient,
      this.fundingContract,
    )
  }

  public get cosmWasmClient(): CosmWasmClient {
    return this._cosmWasmClient as CosmWasmClient
  }

  public get fundingClient(): FundingQueryClient {
    return this._fundingClient as FundingClient
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData
  }
}
