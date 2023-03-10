/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.19.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export interface InstantiateMsg {}
export type ExecuteMsg = {
  set_status: {
    status: SetStatusMsg;
  };
};
export type SetStatusMsg = ("allow_all" | "allow_none") | {
  allow_some: Addr[];
};
export type Addr = string;
export type QueryMsg = {
  get_status: {
    address: Addr;
  };
} | {
  get_allowance: {
    address: Addr;
    sender: Addr;
  };
};
export interface AllowanceResponse {
  allowance: boolean;
}
export type Status = "allow_none" | {
  allow_some: Addr[];
};
export interface StatusResponse {
  status?: Status | null;
}