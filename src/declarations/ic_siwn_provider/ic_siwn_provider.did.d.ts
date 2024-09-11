import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Delegation {
  'pubkey' : Uint8Array | number[],
  'targets' : [] | [Array<Principal>],
  'expiration' : bigint,
}
export interface LoginDetails {
  'user_canister_pubkey' : Uint8Array | number[],
  'expiration' : bigint,
}
export interface PrepareLoginDetails {
  'callback_url' : string,
  'message' : string,
  'nonce' : string,
}
export type Result = { 'Ok' : string } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Principal } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : SignedDelegation } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : LoginDetails } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : PrepareLoginDetails } |
  { 'Err' : string };
export type RuntimeFeature = { 'IncludeUriInSeed' : null };
export interface SettingsInput {
  'runtime_features' : [] | [Array<RuntimeFeature>],
  'app_url' : string,
  'salt' : string,
  'session_expires_in' : [] | [bigint],
  'callback_url' : string,
  'targets' : [] | [Array<string>],
  'chain_id' : [] | [string],
  'sign_in_expires_in' : [] | [bigint],
}
export interface SignedDelegation {
  'signature' : Uint8Array | number[],
  'delegation' : Delegation,
}
export interface _SERVICE {
  '__get_candid_interface_tmp_hack' : ActorMethod<[], string>,
  'get_account_id' : ActorMethod<[Principal], Result>,
  'get_caller_address' : ActorMethod<[], Result>,
  'get_principal' : ActorMethod<[string], Result_1>,
  'icts_name' : ActorMethod<[], string>,
  'icts_version' : ActorMethod<[], string>,
  'siwn_get_delegation' : ActorMethod<
    [string, Uint8Array | number[], bigint],
    Result_2
  >,
  'siwn_login' : ActorMethod<
    [string, string, string, Uint8Array | number[], string],
    Result_3
  >,
  'siwn_prepare_login' : ActorMethod<[string], Result_4>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
