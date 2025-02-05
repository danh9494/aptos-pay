import { AccountAddress, Account, Ed25519Account } from '@aptos-labs/ts-sdk';
import BigNumber from 'bignumber.js';

export type Recipient = AccountAddress;
export type Amount = number | bigint | BigNumber;
export type CoinType = string;
export type Reference = string;
export type Label = string;
export type Message = string;
export type Address = AccountAddress;

export type TXUrl = URL;
