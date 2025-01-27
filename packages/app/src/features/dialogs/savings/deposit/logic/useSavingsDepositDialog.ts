import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { TokenWithBalance, TokenWithValue } from '@/domain/common/types'
import { MakerInfo } from '@/domain/maker-info/types'
import { useMarketInfo } from '@/domain/market-info/useMarketInfo'
import { makeAssetsInWalletList } from '@/domain/savings/makeAssetsInWalletList'
import { Token } from '@/domain/types/Token'
import { useWalletInfo } from '@/domain/wallet/useWalletInfo'
import { Objective } from '@/features/actions/logic/types'
import { AssetInputSchema, useDebouncedDialogFormValues } from '@/features/dialogs/common/logic/form'
import { FormFieldsForDialog, PageState, PageStatus } from '@/features/dialogs/common/types'

import { getFormFieldsForDepositDialog } from './form'
import { createObjectives } from './objectives'
import { useSwap } from './useSwap'
import { SavingsDialogTxOverview, useTxOverview } from './useTransactionOverview'
import { getSavingsDepositDialogFormValidator } from './validation'

export interface UseSavingsDepositDialogParams {
  initialToken: Token
  makerInfo: MakerInfo
}

export interface UseSavingsDepositDialogResults {
  selectableAssets: TokenWithBalance[]
  assetsFields: FormFieldsForDialog
  form: UseFormReturn<AssetInputSchema>
  objectives: Objective[]
  tokenToDeposit: TokenWithValue
  pageStatus: PageStatus
  txOverview: SavingsDialogTxOverview | undefined
}

export function useSavingsDepositDialog({
  initialToken,
  makerInfo,
}: UseSavingsDepositDialogParams): UseSavingsDepositDialogResults {
  const { marketInfo } = useMarketInfo()
  const walletInfo = useWalletInfo()
  const { assets: depositOptions } = makeAssetsInWalletList({ walletInfo })

  const [pageStatus, setPageStatus] = useState<PageState>('form')

  const form = useForm<AssetInputSchema>({
    resolver: zodResolver(getSavingsDepositDialogFormValidator(walletInfo)),
    defaultValues: {
      symbol: initialToken.symbol,
      value: '',
    },
    mode: 'onChange',
  })

  const {
    debouncedFormValues: formValues,
    isDebouncing,
    isFormValid,
  } = useDebouncedDialogFormValues({
    form,
    marketInfo,
  })
  const { swapInfo, swapParams } = useSwap({ formValues, marketInfo, walletInfo })

  const objectives = createObjectives({
    swapInfo,
    swapParams,
    marketInfo,
    makerInfo,
  })
  const txOverview = useTxOverview({
    marketInfo,
    swapInfo,
    walletInfo,
    swapParams,
    makerInfo,
  })
  const tokenToDeposit: TokenWithValue = {
    token: formValues.token,
    value: formValues.value,
  }

  return {
    selectableAssets: depositOptions,
    assetsFields: getFormFieldsForDepositDialog(form, marketInfo, walletInfo),
    form,
    objectives,
    tokenToDeposit,
    txOverview,
    pageStatus: {
      state: pageStatus,
      actionsEnabled: formValues.value.gt(0) && isFormValid && !isDebouncing,
      goToSuccessScreen: () => setPageStatus('success'),
    },
  }
}
