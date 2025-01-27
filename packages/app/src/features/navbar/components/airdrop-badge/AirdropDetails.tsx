import { SPK_MOCK_TOKEN } from '@/domain/types/Token'
import { assets } from '@/ui/assets'
import BoxArrowTopRight from '@/ui/assets/box-arrow-top-right.svg?react'
import { Link } from '@/ui/atoms/link/Link'
import { Skeleton } from '@/ui/atoms/skeleton/Skeleton'
import { links } from '@/ui/constants/links'

import { AirdropInfo } from '../../types'

export function AirdropDetails({ amount, isLoading }: Omit<AirdropInfo, 'isError'>) {
  return (
    <div className="text-basics-dark-grey flex flex-col text-xs">
      <div className="border-basics-grey/50 flex flex-col gap-1 border-b p-4">
        Spark Airdrop Tokens
        <div className="flex items-center gap-2">
          <img src={assets.sparkIcon} className="h-7 lg:h-6" />
          {isLoading ? (
            <Skeleton className="h-5 w-7" />
          ) : (
            <div className="text-basics-black text-base font-semibold">
              {SPK_MOCK_TOKEN.format(amount, { style: 'auto' })} {SPK_MOCK_TOKEN.symbol}
            </div>
          )}
        </div>
      </div>
      <div className="flex max-w-60 flex-col gap-2 p-4">
        DAI borrowers with volatile assets and ETH depositors will be eligible for a future ⚡ SPK airdrop.
        <Link
          to={links.sparkAirdropFormula}
          external
          className="text-basics-dark-grey flex items-center gap-2.5 text-sm font-medium"
        >
          <BoxArrowTopRight className="h-4 w-4" />
          Learn more
        </Link>
      </div>
    </div>
  )
}
