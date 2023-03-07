import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { WalletData } from './wallet';
import { FundingClient, FundingQueryClient } from 'types/Funding.client';
import { Cw20SparkClient, Cw20SparkQueryClient } from 'types/Cw20Spark.client';

const getCosmWasmClientImport = import('./cosmwasm/getCosmWasmClient');

export interface SparkClientContructor {
  wallet: WalletData | null;
  fundingContract: string;
  cw20Contract: string;
  signingCosmWasmClient: SigningCosmWasmClient | null;
}

export class SparkClient {
  private _cosmWasmClient: CosmWasmClient | null = null;
  public signingCosmWasmClient: SigningCosmWasmClient | null = null;

  private _fundingClient: FundingQueryClient | null = null;
  private _cw20Client: Cw20SparkQueryClient | null = null;

  public fundingContract: string;
  public cw20Contract: string;

  private _wallet: WalletData | null = null;

  constructor({ wallet, fundingContract, cw20Contract, signingCosmWasmClient }: SparkClientContructor) {
    this._wallet = wallet;
    this.fundingContract = fundingContract;
    this.cw20Contract = cw20Contract;
    this.signingCosmWasmClient = signingCosmWasmClient;
  }

  public async connect() {
    if (this._cosmWasmClient) {
      return;
    }

    const getCosmWasmClient = (await getCosmWasmClientImport).default;
    // create cosmwasm client
    this._cosmWasmClient = await getCosmWasmClient(process.env.NEXT_PUBLIC_RPC!);

    this._fundingClient = new FundingQueryClient(this.cosmWasmClient, this.fundingContract);
    this._cw20Client = new Cw20SparkQueryClient(this.cosmWasmClient, this.cw20Contract);
  }

  public get cosmWasmClient(): CosmWasmClient {
    return this._cosmWasmClient as CosmWasmClient;
  }

  public get cw20Client(): Cw20SparkQueryClient {
    return this._cw20Client as Cw20SparkClient;
  }

  public get fundingClient(): FundingQueryClient {
    return this._fundingClient as FundingClient;
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData;
  }
}
