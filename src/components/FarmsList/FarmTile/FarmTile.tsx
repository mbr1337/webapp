import { Grid, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { Token } from '@consts/static'
import { Link } from 'react-router-dom'
import DotIcon from '@material-ui/icons/FiberManualRecordRounded'
import classNames from 'classnames'
import { OutlinedButton } from '@components/OutlinedButton/OutlinedButton'
import SwapList from '@static/svg/swap-list.svg'
import { formatNumbers, showPrefix, thresholdsWithTokenDecimal } from '@consts/utils'
import useStyle from './style'
export interface IFarm {
  isActive?: boolean
  apyPercent: number
  totalStakedInXToken: number
  yourStakedInXToken: number
  totalStakedInYToken: number
  yourStakedInYToken: number
  tokenX: Token
  tokenY: Token
  farmId: string
  rewardSymbol: string
  rewardIcon: string
  feeTier: number
}

export const FarmTile: React.FC<IFarm> = ({
  isActive = false,
  apyPercent,
  totalStakedInXToken,
  totalStakedInYToken,
  yourStakedInXToken,
  yourStakedInYToken,
  tokenX,
  tokenY,
  farmId,
  rewardSymbol,
  rewardIcon,
  feeTier
}) => {
  const classes = useStyle()

  const [xToY, setXtoY] = useState(true)

  const totalsData = xToY
    ? {
        totalStaked: totalStakedInXToken,
        userStaked: yourStakedInXToken,
        totalSymbol: tokenX.symbol,
        totalDecimals: tokenX.decimals
      }
    : {
        totalStaked: totalStakedInYToken,
        userStaked: yourStakedInYToken,
        totalSymbol: tokenY.symbol,
        totalDecimals: tokenY.decimals
      }

  return (
    <Grid className={classes.root} container direction='column'>
      <Grid container direction='row' justifyContent='space-between' wrap='nowrap'>
        <Grid className={classes.flexWrapper}>
          <Grid className={classes.icons}>
            <img src={(xToY ? tokenX : tokenY).logoURI} className={classes.icon} />
            <img
              className={classes.arrows}
              src={SwapList}
              alt='Arrow'
              onClick={() => {
                setXtoY(!xToY)
              }}
            />
            <img src={(xToY ? tokenY : tokenX).logoURI} className={classes.icon} />
          </Grid>
          <Typography className={classes.names}>
            {(xToY ? tokenX : tokenY).symbol}-{(xToY ? tokenY : tokenX).symbol}
          </Typography>
        </Grid>
        <Grid className={classes.activityWrapper}>
          {isActive ? <Grid className={classes.pulseDot} /> : <DotIcon className={classes.dot} />}
          <Typography
            className={classNames(
              classes.activity,
              isActive ? classes.greenText : classes.greyText
            )}>
            {isActive ? 'Active' : 'Inactive'}
          </Typography>
        </Grid>
      </Grid>
      <Grid
        className={classes.rewardRow}
        container
        justifyContent='space-between'
        alignItems='center'>
        <Typography className={classes.rewardLabel}>Reward token:</Typography>
        <Grid className={classes.rewardTokenWrapper}>
          <img className={classes.rewardIcon} src={rewardIcon} />
          <Typography className={classes.rewardToken}>{rewardSymbol}</Typography>
        </Grid>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        wrap='nowrap'
        className={classNames(classes.mobileContainer, classes.spacer)}>
        <Typography className={classes.label}>Fee tier:</Typography>
        <Typography className={classes.value}>{feeTier}%</Typography>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        wrap='nowrap'
        className={classes.mobileContainer}>
        <Typography className={classes.label}>APY:</Typography>
        <Typography className={classes.value}>{apyPercent}%</Typography>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        wrap='nowrap'
        className={classes.mobileContainer}>
        <Typography className={classes.label}>Total staked:</Typography>
        <Typography className={classes.value}>
          {formatNumbers(thresholdsWithTokenDecimal(totalsData.totalDecimals))(
            totalsData.totalStaked.toString()
          )}
          {showPrefix(totalsData.totalStaked)} {totalsData.totalSymbol}
        </Typography>
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        wrap='nowrap'
        className={classes.mobileContainer}>
        <Typography className={classes.label}>Your staked:</Typography>
        <Typography className={classes.value}>
          {formatNumbers(thresholdsWithTokenDecimal(totalsData.totalDecimals))(
            totalsData.userStaked.toString()
          )}
          {showPrefix(totalsData.userStaked)} {totalsData.totalSymbol}
        </Typography>
      </Grid>
      <Link className={classes.link} to={`/farm/${farmId}`}>
        <OutlinedButton className={classes.button} disabled={!isActive} name='Details' />
      </Link>
    </Grid>
  )
}

export default FarmTile
