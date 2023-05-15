import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { WalletData } from './wallet';
import { FundingClient, FundingQueryClient } from 'types/Funding.client';
import { Cw20SparkClient, Cw20SparkQueryClient } from 'types/Cw20Spark.client';
import { RPC } from 'util/constants';
import { RangoClient } from 'rango-sdk';

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

  private _rangoClient: RangoClient | null = null;

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
    this._cosmWasmClient = await getCosmWasmClient(RPC);

    this._fundingClient = new FundingQueryClient(this.cosmWasmClient, this.fundingContract);
    this._cw20Client = new Cw20SparkQueryClient(this.cosmWasmClient, this.cw20Contract);
    this._rangoClient = new RangoClient(process.env.NEXT_PUBLIC_RANGO_API_KEY!);
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

  public get rangoClient(): RangoClient {
    return this._rangoClient as RangoClient;
  }

  public get wallet(): WalletData {
    return this._wallet as WalletData;
  }
}
