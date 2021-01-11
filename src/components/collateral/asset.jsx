import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  Button
} from '@material-ui/core';
import { colors } from '../../theme'

import {
  ERROR,

  DEPOSIT,
  DEPOSIT_RETURNED,
  DEPOSIT_ALL,
  DEPOSIT_ALL_RETURNED,

  WITHDRAW,
  WITHDRAW_RETURNED,
  WITHDRAW_ALL,
  WITHDRAW_ALL_RETURNED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = theme => ({
  value: {
    cursor: 'pointer'
  },
  actionInput: {
    padding: '0px 0px 12px 0px',
    fontSize: '0.5rem'
  },
  balances: {
    width: '100%',
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  actionsContainer: {
    paddingBottom: '12px',
    display: 'flex',
    flex: '1',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  title: {
    paddingRight: '24px'
  },
  actionButton: {
    height: '47px'
  },
  tradeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sepperator: {
    borderBottom: '1px solid #E1E1E1',
    margin: '24px',
    [theme.breakpoints.up('sm')]: {
      width: '40px',
      borderBottom: 'none',
      margin: '0px'
    }
  },
  verticalSepperator: {
    margin: '12px',
    width: '100%'
  },
  scaleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 0px 12px 0px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scale: {
    minWidth: '10px'
  },
  buttonText: {
    fontWeight: '700',
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  heading: {
    paddingBottom: '12px',
    flex: 1,
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    }
  },
  right: {
    textAlign: 'right'
  },
  buttons: {
    display: 'flex',
    width: '100%'
  },
  disabledContainer: {
    width: '100%',
    paddingTop: '12px',
    textAlign: 'center'
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: '#dedede',
    borderRadius: '24px',
    padding: '24px',
    marginBottom: '12px'
  },
  priceHeading: {
    paddingBottom: '12px'
  },
  priceConversion: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  conversionDirection: {
    color: colors.darkGray
  },
});


class Asset extends Component {

  constructor() {
    super()

    this.state = {
      amount: '',
      amountError: false,
      redeemAmount: '',
      redeemAmountError: false,
      account: store.getStore('account'),
      scAsset: store.getStore('scAsset'),
      calculatedDepositAmount: null,
      calculatedWithdrawAmount: null
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.on(DEPOSIT_ALL_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_ALL_RETURNED, this.withdrawReturned);
    emitter.on(ERROR, this.errorReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(DEPOSIT_ALL_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_ALL_RETURNED, this.withdrawReturned);
    emitter.removeListener(ERROR, this.errorReturned);
  };

  depositReturned = () => {
    this.setState({ loading: false, amount: '' })
  };

  withdrawReturned = (txHash) => {
    this.setState({ loading: false, redeemAmount: '' })
  };

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  depositAmountReturned = (amount) => {
    if(amount.sendAmount === this.state.amount) {
      this.setState({ calculatedDepositAmount: amount })
    }
  }

  withdrawAmountReturned = (amount) => {
    if(amount.sendAmount === this.state.redeemAmount) {
      this.setState({
        calculatedWithdrawAmount: amount
      })
    }
  }

  render() {
    const { classes, asset } = this.props;
    const {
      scAsset,
      amount,
      amountError,
      redeemAmount,
      redeemAmountError,
      loading
    } = this.state

    return (<div className={ classes.actionsContainer }>
      <div className={ classes.tradeContainer }>
        <div className={ classes.balances }>
          <Typography variant='h4' onClick={ () => { this.setAmount(100) } } className={ classes.value } noWrap>{ 'Balance: '+ (asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset.tokenSymbol ? asset.tokenSymbol : asset.symbol }</Typography>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='amount'
          value={ amount }
          error={ amountError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="0.00"
          variant="outlined"
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        { this.renderDepositPrice() }
        <div className={ classes.buttons }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
            onClick={ this.onDeposit }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color={'secondary'}>Deposit</Typography>
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.balance <= 0 || asset.depositDisabled === true }
            onClick={ this.onDepositAll }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color={'secondary'}>Deposit All</Typography>
          </Button>
        </div>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>Balance: { (asset.creditBalance ? (Math.floor(asset.creditBalance*10000)/10000).toFixed(4) : '0.0000') } {scAsset.symbol} </Typography>
        </div>
        <TextField
          fullWidth
          className={ classes.actionInput }
          id='redeemAmount'
          value={ redeemAmount }
          error={ redeemAmountError }
          onChange={ this.onChange }
          disabled={ loading }
          placeholder="0.00"
          variant="outlined"
        />
        <div className={ classes.scaleContainer }>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(25) } }>
            <Typography variant={'h5'}>25%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(50) } }>
            <Typography variant={'h5'}>50%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(75) } }>
            <Typography variant={'h5'}>75%</Typography>
          </Button>
          <Button
            className={ classes.scale }
            variant='text'
            disabled={ loading }
            color="primary"
            onClick={ () => { this.setRedeemAmount(100) } }>
            <Typography variant={'h5'}>100%</Typography>
          </Button>
        </div>
        { this.renderWithdrawPrice() }
        <div className={ classes.buttons }>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.vaultBalance <= 0 }
            onClick={ this.onWithdraw }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw</Typography>
          </Button>
          <Button
            className={ classes.actionButton }
            variant="outlined"
            color="primary"
            disabled={ loading || asset.vaultBalance <= 0 }
            onClick={ this.onWithdrawAll }
            fullWidth
            >
            <Typography className={ classes.buttonText } variant={ 'h5'} color='secondary'>Withdraw All</Typography>
          </Button>
        </div>
      </div>
    </div>)
  };

  renderDepositPrice = () => {

    const {
      classes,
      asset
    } = this.props
    const {
      calculatedDepositAmount,
      scAsset
    } = this.state

    if(!calculatedDepositAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `${scAsset.symbol} per ${asset.symbol}` }</Typography>
          <Typography variant='h3' >{ calculatedDepositAmount ? calculatedDepositAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>You will receive {scAsset.symbol}</Typography>
          <Typography variant='h3' >{ calculatedDepositAmount ? calculatedDepositAmount.returnPrice.toFixed(4) : '-' }</Typography>
        </div>
      </div>
    )
  }

  renderWithdrawPrice = () => {

    const {
      classes,
      asset
    } = this.props
    const {
      calculatedWithdrawAmount
    } = this.state

    if(!calculatedWithdrawAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `${asset.symbol} per Xii` }</Typography>
          <Typography variant='h3' >{ calculatedWithdrawAmount ? calculatedWithdrawAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>You will receive { asset.symbol }</Typography>
          <Typography variant='h3' >{ calculatedWithdrawAmount ? calculatedWithdrawAmount.returnPrice.toFixed(4) : '-' }</Typography>
        </div>
      </div>
    )
  }


  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)
  }

  onDeposit = () => {
    this.setState({ amountError: false })

    const { amount } = this.state
    const { asset, startLoading } = this.props

    if(!amount || isNaN(amount) || amount <= 0 || amount > asset.balance) {
      this.setState({ amountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT, content: { amount: amount, asset: asset } })
  }

  onWithdraw = () => {
    this.setState({ redeemAmountError: false })

    const { redeemAmount } = this.state
    const { asset, startLoading  } = this.props

    if(!redeemAmount || isNaN(redeemAmount) || redeemAmount <= 0 || redeemAmount > asset.vaultBalance) {
      this.setState({ redeemAmountError: true })
      return false
    }

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: WITHDRAW, content: { amount: redeemAmount, asset: asset } })
  }

  onDepositAll = () => {
    const { asset, startLoading } = this.props

    this.setState({ loading: true })
    startLoading()
    dispatcher.dispatch({ type: DEPOSIT_ALL, content: { asset: asset } })
  }

  onWithdrawAll = () => {
    const { asset, startLoading  } = this.props

    this.setState({ loading: true })
    startLoading()

    dispatcher.dispatch({ type: WITHDRAW_ALL, content: { asset: asset } })
  }

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ amount: amount.toFixed(4) })
  }

  setRedeemAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.creditBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
