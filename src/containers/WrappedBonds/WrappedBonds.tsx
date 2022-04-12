import React, { useEffect, useMemo, useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@reducers/bonds'
import { status, swapTokensDict } from '@selectors/solanaWallet'
import loader from '@static/gif/loader.gif'
import { Status } from '@reducers/solanaWallet'
import { bondsList, isLoadingBondsList, userVested } from '@selectors/bonds'
import BondList from '@components/Bonds/BondList/BondList'
import PositionsList from '@components/Bonds/UserList/PositionsList/PositionsList'
import { BN } from '@project-serum/anchor'
import BuyBondModal from '@components/Modals/BuyBondModal/BuyBondModal'
import { blurContent, unblurContent } from '@consts/uiUtils'
import { USDC_DEV } from '@consts/static'
import { actions as snackbarsActions } from '@reducers/snackbars'
import useStyles from './styles'
import { printBN } from '@consts/utils'
import { PublicKey } from '@solana/web3.js'

export const WrappedBonds: React.FC = () => {
  const classes = useStyles()

  const dispatch = useDispatch()

  const walletStatus = useSelector(status)
  const bondsListLoading = useSelector(isLoadingBondsList)
  const allBonds = useSelector(bondsList)
  const allUserVested = useSelector(userVested)
  const allTokens = useSelector(swapTokensDict)

  useEffect(() => {
    dispatch(actions.getBondsList())
  }, [])

  useEffect(() => {
    if (walletStatus === Status.Initialized) {
      dispatch(actions.getUserVested())
    }
  }, [walletStatus])

  const [modalBondIndex, setModalBondIndex] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const bondsData = useMemo(() => {
    return allBonds.map((bond, index) => {
      return {
        bondToken: allTokens[bond.tokenBond.toString()],
        quoteToken: allTokens[bond.tokenQuote.toString()],
        roiPercent: 0,
        supply: +printBN(bond.supply.v, allTokens[bond.tokenBond.toString()].decimals),
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        vesting: bond.vestingTime.div(new BN(60 * 60 * 24)).toString() + ' days',
        onBondClick: () => {
          if (walletStatus === Status.Initialized) {
            setModalBondIndex(index)
            blurContent()
            setModalOpen(true)
          } else {
            dispatch(
              snackbarsActions.add({
                message: 'Connect wallet to buy bonds',
                variant: 'warning',
                persist: false
              })
            )
          }
        }
      }
    })
  }, [allBonds, allTokens])

  const userVestedData = useMemo(() => {
    return Array(2)
      .fill({})
      .map(() => {
        return {
          bondToken: {
            balance: new BN(100).mul(new BN(34786)),
            decimals: 6,
            symbol: 'SOL',
            assetAddress: new PublicKey('So11111111111111111111111111111111111111112'),
            name: 'Wrapped Solana',
            logoURI:
              'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
          },
          quoteToken: {
            balance: new BN(100).mul(new BN(126)),
            decimals: 6,
            symbol: 'BTC',
            assetAddress: new PublicKey('9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E'),
            name: 'BTC',
            logoURI:
              'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png'
          },
          bought: 2137,
          redeemable: 8553,
          vestPeriod: '1/3 days',
          onRedeemClick: () => {}
        }
      })
  }, [allUserVested, allTokens])

  const placeholderToken = {
    ...USDC_DEV,
    assetAddress: USDC_DEV.address,
    balance: new BN(0)
  }

  return (
    <Grid container className={classes.wrapper} direction='column'>
      {bondsListLoading ? (
        <img src={loader} className={classes.loading} />
      ) : (
        <>
          <Typography className={classes.header}>Bonds</Typography>
          <Typography className={classes.desc}>
            Thanks to bonds mechanism, you can obtain newly introduced tokens at low price. There
            are various vesting options you can choose to filter available bonds and find the
            desired one. In the bottom part you can see how many tokens you are eligible to withdraw
            and how much time is left that you can claim the remaining part.
          </Typography>
          <BondList data={bondsData} />
          {walletStatus === Status.Initialized && userVestedData.length > 0 ? (
            <>
              <Typography className={classes.header} style={{ marginTop: 16 }}>
                Your vested positions
              </Typography>
              <PositionsList data={userVestedData} />
            </>
          ) : null}
          <BuyBondModal
            open={modalOpen}
            bondToken={
              modalBondIndex === null ? placeholderToken : bondsData[modalBondIndex].bondToken
            }
            quoteToken={
              modalBondIndex === null ? placeholderToken : bondsData[modalBondIndex].quoteToken
            }
            roi={modalBondIndex === null ? 0 : +bondsData[modalBondIndex].roiPercent}
            price={0}
            supply={modalBondIndex === null ? 0 : +bondsData[modalBondIndex].supply}
            vestingTerm={modalBondIndex === null ? '' : bondsData[modalBondIndex].vesting}
            handleClose={() => {
              setModalOpen(false)
              unblurContent()
            }}
            onBuy={() => {
              setModalOpen(false)
              unblurContent()
            }}
          />
        </>
      )}
    </Grid>
  )
}

export default WrappedBonds
