import { UseQueryResult } from '@tanstack/react-query'
import { Address, Hex } from 'viem'

import { SimplifiedQueryResult } from '@/features/actions/logic/simplifyQueryResult'

import { CheckedAddress } from '../types/CheckedAddress'
import { BaseUnitNumber, NormalizedUnitNumber, Percentage } from '../types/NumericValues'
import { Token } from '../types/Token'

export interface SwapParams {
  type: SwapType
  fromToken: Token
  toToken: Token
  value: NormalizedUnitNumber
  maxSlippage: Percentage
}

export type SwapType =
  | 'direct' // ex:  sell 10 DAI (fromToken) for XXX USDC (toToken)
  | 'reverse' // ex: sell XX DAI (fromToken) for ~10 USDC (toToken)

export interface SwapRequest {
  fromToken: CheckedAddress
  toToken: CheckedAddress
  type: SwapType
  estimate: {
    feeCostsUSD: NormalizedUnitNumber
    fromAmount: BaseUnitNumber
    toAmount: BaseUnitNumber
  }

  txRequest: TxRequest
}

export interface TxRequest {
  from: Address
  to: Address
  data: Hex
  value: bigint
  gasLimit: bigint
  gasPrice: bigint
}

export type SwapInfo = UseQueryResult<SwapRequest>
export type SwapInfoSimplified = SimplifiedQueryResult<SwapRequest>
