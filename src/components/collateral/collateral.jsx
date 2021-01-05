import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { colors } from '../../theme'

import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  DEPOSIT_RETURNED,
  WITHDRAW_RETURNED,

  STAKE,
  STAKE_RETURNED,
  UNSTAKE,
  UNSTAKE_RETURNED,
  CLAIM,
  CLAIM_RETURNED
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  investedContainerLoggedOut: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  investedContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '100%',
    marginTop: '40px',
    [theme.breakpoints.up('md')]: {
      minWidth: '900px',
    }
  },
  balancesContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    padding: '12px 12px',
    position: 'relative',
  },
  connectContainer: {
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '450',
    }
  },
  intro: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '32px',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      maxWidth: 'calc(100vw - 24px)',
      flexWrap: 'wrap'
    }
  },
  introCenter: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    padding: '24px 0px'
  },
  introText: {
    paddingLeft: '20px'
  },
  heading: {
    display: 'none',
    flex: 1,
    [theme.breakpoints.up('md')]: {
      display: 'block'
    }
  },
  headingName: {
    display: 'flex',
    alignItems: 'center',
    width: '325px',
    [theme.breakpoints.down('sm')]: {
      width: 'auto',
      flex: 1
    }
  },
  headingEarning: {
    display: 'none',
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  },
  assetSummary: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    flexWrap: 'wrap',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'nowrap'
    }
  },
  assetIcon: {
    display: 'flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    borderRadius: '20px',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    marginRight: '20px',
    [theme.breakpoints.up('sm')]: {
      height: '40px',
      width: '40px',
      marginRight: '24px',
    }
  },
  addressContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    whiteSpace: 'nowrap',
    fontSize: '0.83rem',
    textOverflow:'ellipsis',
    cursor: 'pointer',
    padding: '28px 30px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    alignItems: 'center',
    maxWidth: '450px',
    [theme.breakpoints.up('md')]: {
      width: '100%'
    }
  },
  between: {
    width: '24px'
  },
  expansionPanel: {
    maxWidth: 'calc(100vw - 24px)',
    width: '100%'
  },
  versionToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableHeadContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  investAllContainer: {
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%'
  },
  disaclaimer: {
    padding: '12px',
    border: '1px solid rgb(174, 174, 174)',
    borderRadius: '0.75rem',
    marginBottom: '24px',
    lineHeight: '1.2',
    background: colors.white
  },
  fees: {
    paddingRight: '75px',
    padding: '12px',
    lineHeight: '1.2',
  },
  walletAddress: {
    padding: '0px 12px'
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  grey: {
    color: colors.darkGray
  },
  filters: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 12px'
    },
  },
  searchField: {
    flex: 1,
    background: colors.white,
    borderRadius: '50px'
  },
  checkbox: {
    flex: 1,
    margin: '0px !important'
  },
  flexy: {
    display: 'flex',
    alignItems: 'center'
  },
  on: {
    color: colors.darkGray,
    padding: '0px 6px'
  },
  positive: {
    color: colors.compoundGreen
  },
  portfolioContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '40px'
  },
  titleBalance: {
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  titleBalanceClaim: {
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.lightBlue,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  whiteText: {
    color: colors.white
  },
  inline: {
    display: 'flex',
    alignItems: 'baseline'
  },
  symbol: {
    paddingLeft: '6px'
  },
  gray: {
    color: colors.darkGray
  },
  stakeButton: {
    background: colors.blue,
    width: '100%',
    borderRadius: '0px 0px 50px 50px',
    height: '50px',
    '&:hover': {
      background: colors.borderBlue
    }
  },
  titleBalanceValues: {
    justifyContent: 'center',
    padding: '20px 10px',
    flex: 1
  }
});

class Collateral extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('assets'),
      scAsset: store.getStore('scAsset'),
      account: account,
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES, content: {} })
    }
  }
  componentWillMount() {
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.on(DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.on(CLAIM_RETURNED, this.claimReturned);
    emitter.on(STAKE_RETURNED, this.stakeReturned);
    emitter.on(UNSTAKE_RETURNED, this.unstakeReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(CLAIM_RETURNED, this.claimReturned);
    emitter.removeListener(STAKE_RETURNED, this.stakeReturned);
    emitter.removeListener(UNSTAKE_RETURNED, this.unstakeReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false })
  };

  withdrawReturned = (txHash) => {
    this.setState({ loading: false })
  };

  claimReturned = (txHash) => {
    this.setState({ loading: false })
  };

  stakeReturned = (txHash) => {
    this.setState({ loading: false })
  };

  unstakeReturned = (txHash) => {
    this.setState({ loading: false })
  };

  balancesReturned = (balances) => {
    this.setState({
      assets: store.getStore('assets'),
      scAsset: store.getStore('scAsset'),
    })
  };

  connectionConnected = () => {
    const account = store.getStore('account')
    this.setState({ account: account })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: null })
  }

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      scAsset
    } = this.state

    if(!account || !account.address) {
      return (<div></div>)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.portfolioContainer }>
          <div className={ classes.titleBalance }>
            <div className={ classes.titleBalanceValues }>
              <Typography variant={ 'h2' } noWrap>${ scAsset.balance.toFixed(2) }</Typography>
              <Typography variant={ 'h4' } className={ classes.gray }>Credit Available</Typography>
            </div>
            <Button
              color="primary"
              disabled={ loading || scAsset.balance <= 0 }
              onClick={ this.onStake }
              className={ classes.stakeButton }
              >
              <Typography variant={ 'h5'} className={ classes.whiteText }>Stake</Typography>
            </Button>
          </div>
          <div className={ classes.between }>
          </div>
          <div className={ classes.titleBalance }>
            <div className={ classes.titleBalanceValues }>
              <Typography variant={ 'h2' } noWrap>${ scAsset.stakedBalance.toFixed(2) }</Typography>
              <Typography variant={ 'h4' } className={ classes.gray }>Credit Staked</Typography>
            </div>
            <Button
              color="primary"
              disabled={ loading || scAsset.stakedBalance <= 0 }
              onClick={ this.onUnstake }
              className={ classes.stakeButton }
              >
              <Typography variant={ 'h5'} className={ classes.whiteText }>Unstake</Typography>
            </Button>
          </div>
          <div className={ classes.between }>
          </div>
          <div className={ classes.titleBalance }>
            <div className={ classes.titleBalanceValues }>
              <Typography variant={ 'h2' } noWrap>${ scAsset.claimableBalance.toFixed(2) }</Typography>
              <Typography variant={ 'h4' } className={ classes.gray }>Claimable</Typography>
            </div>
            <Button
              color="primary"
              disabled={ loading || scAsset.claimableBalance <= 0 }
              onClick={ this.onClaim }
              className={ classes.stakeButton }
              >
              <Typography variant={ 'h5'} className={ classes.whiteText }>Claim</Typography>
            </Button>
          </div>
        </div>
        <div className={ classes.investedContainer }>
          { this.renderAssetBlocks() }
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocks = () => {
    const { assets, expanded, scAsset } = this.state
    const { classes } = this.props
    const width = window.innerWidth

    return assets.sort(this.sortAsses).map((asset) => {
      return (
        <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ this.getLogoForAsset(asset) }
                    height={ width > 600 ? '40px' : '30px'}
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' } noWrap>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h5' } className={ classes.grey }>Collateral Minted:</Typography>
                <Typography variant={ 'h3' } noWrap>{ (asset.creditBalance ? (asset.creditBalance).toFixed(2) : '0.00') } {scAsset.symbol}</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h5' } className={ classes.grey }>Available to deposit:</Typography>
                <Typography variant={ 'h3' } noWrap>{ (asset.balance ? (asset.balance).toFixed(2) : '0.00')+' '+asset.symbol }</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  sortAsses = (a, b) => {

    if(a.creditBalance > b.creditBalance) {
      return -1
    } else if (a.creditBalance < b.creditBalance) {
      return 1
    } else {
      if (a.balance > b.balance) {
        return -1
      } else if (a.balance < b.balance) {
        return 1
      } else {
        if(a.name > b.name) {
          return 1
        } else if(a.name < b.name) {
          return -1
        }
      }
    }

    return 0
  }

  getLogoForAsset = (asset) => {
    try {
      return require('../../assets/tokens/'+asset.symbol+'-logo.png')
    } catch {
      return require('../../assets/tokens/unknown-logo.png')
    }
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  onUnstake = () => {
    const { scAsset } = this.state

    this.setState({ loading: true })

    dispatcher.dispatch({ type: UNSTAKE, content: { asset: scAsset } })
  }

  onStake = () => {
    const { scAsset } = this.state

    this.setState({ loading: true })

    dispatcher.dispatch({ type: STAKE, content: { asset: scAsset } })
  }

  onClaim = () => {
    const { scAsset } = this.state

    this.setState({ loading: true })

    dispatcher.dispatch({ type: CLAIM, content: { asset: scAsset } })
  }
}

export default withRouter(withStyles(styles)(Collateral));
