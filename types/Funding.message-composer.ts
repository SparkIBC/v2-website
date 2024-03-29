/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import { Coin } from '@cosmjs/amino';
import { MsgExecuteContractEncodeObject } from 'cosmwasm';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import {
  InstantiateMsg,
  ExecuteMsg,
  Uint128,
  Binary,
  FundMsg,
  AddressType,
  Addr,
  Cw20ReceiveMsg,
  Link,
  QueryMsg,
  Status,
  GetCampaignResponse,
  Campaign,
  GetDonorResponse,
  Donor
} from './Funding.types';
export interface FundingMessage {
  contractAddress: string;
  sender: string;
  addCampaign: (
    {
      campaignAddress,
      campaignName
    }: {
      campaignAddress: string;
      campaignName: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  disableCampaign: (
    {
      campaignName
    }: {
      campaignName: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  receive: (
    {
      amount,
      msg,
      sender
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  fund: (
    {
      campaign_name,
      donor_address_type,
      on_behalf_of
    }: {
      campaign_name?: string;
      donor_address_type: 'Validator' | 'Private';
      on_behalf_of?: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  adminFund: (
    {
      amount,
      fundMsg,
      to
    }: {
      amount: Uint128;
      fundMsg: FundMsg;
      to: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  updateAdmins: (
    {
      admins
    }: {
      admins: Addr[];
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  updateConfig: (
    {
      blacklistContractAddress,
      cw20DonationTokenAddress,
      generalFundAddress,
      nativeTokenDenom,
      sparkTokenContractAddress
    }: {
      blacklistContractAddress?: string;
      cw20DonationTokenAddress?: string;
      generalFundAddress?: string;
      nativeTokenDenom?: string;
      sparkTokenContractAddress?: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  updateNickname: (
    {
      nickname
    }: {
      nickname?: string;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
  updateValidatorLink: (
    {
      validatorLink
    }: {
      validatorLink?: Link;
    },
    funds?: Coin[]
  ) => MsgExecuteContractEncodeObject;
}
export class FundingMessageComposer implements FundingMessage {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.addCampaign = this.addCampaign.bind(this);
    this.disableCampaign = this.disableCampaign.bind(this);
    this.receive = this.receive.bind(this);
    this.fund = this.fund.bind(this);
    this.adminFund = this.adminFund.bind(this);
    this.updateAdmins = this.updateAdmins.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.updateNickname = this.updateNickname.bind(this);
    this.updateValidatorLink = this.updateValidatorLink.bind(this);
  }

  addCampaign = (
    {
      campaignAddress,
      campaignName
    }: {
      campaignAddress: string;
      campaignName: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            add_campaign: {
              campaign_address: campaignAddress,
              campaign_name: campaignName
            }
          })
        ),
        funds
      })
    };
  };
  disableCampaign = (
    {
      campaignName
    }: {
      campaignName: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            disable_campaign: {
              campaign_name: campaignName
            }
          })
        ),
        funds
      })
    };
  };
  receive = (
    {
      amount,
      msg,
      sender
    }: {
      amount: Uint128;
      msg: Binary;
      sender: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            receive: {
              amount,
              msg,
              sender
            }
          })
        ),
        funds
      })
    };
  };
  fund = (
    {
      campaign_name,
      donor_address_type,
      on_behalf_of
    }: {
      campaign_name?: string;
      donor_address_type: 'Validator' | 'Private' | 'Organization';
      on_behalf_of?: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    const fundMsg = campaign_name
      ? {
          fund_campaign: {
            campaign_name,
            donor_address_type,
            on_behalf_of: on_behalf_of || null
          }
        }
      : {
          fund_general: {
            donor_address_type,
            on_behalf_of: on_behalf_of || null
          }
        };
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            fund: fundMsg
          })
        ),
        funds
      })
    };
  };
  adminFund = (
    {
      amount,
      fundMsg,
      to
    }: {
      amount: Uint128;
      fundMsg: FundMsg;
      to: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            admin_fund: {
              amount,
              fund_msg: fundMsg,
              to
            }
          })
        ),
        funds
      })
    };
  };
  updateAdmins = (
    {
      admins
    }: {
      admins: Addr[];
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            update_admins: {
              admins
            }
          })
        ),
        funds
      })
    };
  };
  updateConfig = (
    {
      blacklistContractAddress,
      cw20DonationTokenAddress,
      generalFundAddress,
      nativeTokenDenom,
      sparkTokenContractAddress
    }: {
      blacklistContractAddress?: string;
      cw20DonationTokenAddress?: string;
      generalFundAddress?: string;
      nativeTokenDenom?: string;
      sparkTokenContractAddress?: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            update_config: {
              blacklist_contract_address: blacklistContractAddress,
              cw20_donation_token_address: cw20DonationTokenAddress,
              general_fund_address: generalFundAddress,
              native_token_denom: nativeTokenDenom,
              spark_token_contract_address: sparkTokenContractAddress
            }
          })
        ),
        funds
      })
    };
  };
  updateNickname = (
    {
      nickname
    }: {
      nickname?: string;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            update_nickname: {
              nickname
            }
          })
        ),
        funds
      })
    };
  };
  updateValidatorLink = (
    {
      validatorLink
    }: {
      validatorLink?: Link;
    },
    funds?: Coin[]
  ): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(
          JSON.stringify({
            update_validator_link: {
              validator_link: validatorLink
            }
          })
        ),
        funds
      })
    };
  };
}
