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
  GET_DEPOSIT_AMOUNT,
  DEPOSIT_AMOUNT_RETURNED,

  WITHDRAW,
  WITHDRAW_RETURNED,
  GET_WITHDRAW_AMOUNT,
  WITHDRAW_AMOUNT_RETURNED,
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
      calculatedDepositAmount: null,
      calculatedWithdrawAmount: null
    }
  }

  componentWillMount() {
    emitter.on(DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(DEPOSIT_AMOUNT_RETURNED, this.depositAmountReturned);
    emitter.on(WITHDRAW_AMOUNT_RETURNED, this.withdrawAmountReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_RETURNED, this.withdrawReturned);
    emitter.removeListener(DEPOSIT_AMOUNT_RETURNED, this.depositAmountReturned);
    emitter.removeListener(WITHDRAW_AMOUNT_RETURNED, this.withdrawAmountReturned);
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
          onKeyDown={ this.inputKeyDown }
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
            <Typography className={ classes.buttonText } variant={ 'h5'} color={asset.disabled?'':'secondary'}>Deposit</Typography>
          </Button>
        </div>
      </div>
      <div className={ classes.sepperator }></div>
      <div className={classes.tradeContainer}>
        <div className={ classes.balances }>
          <Typography variant='h4' onClick={ () => { this.setRedeemAmount(100) } }  className={ classes.value } noWrap>Balance: { (asset.scUSDBalance ? (Math.floor(asset.scUSDBalance*10000)/10000).toFixed(4) : '0.0000') } scUSD ({ (asset.depositedBalance ? (Math.floor(asset.depositedBalance*10000)/10000).toFixed(4) : '0.0000') } { asset.symbol }) </Typography>
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
          onKeyDown={ this.inputRedeemKeyDown }
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
      calculatedDepositAmount
    } = this.state

    if(!calculatedDepositAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `scUSD per ${asset.symbol}` }</Typography>
          <Typography variant='h3' >{ calculatedDepositAmount ? calculatedDepositAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>You will receive scUSD</Typography>
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
          <Typography variant='h4' className={ classes.conversionDirection }>{ `${asset.symbol} per scUSD` }</Typography>
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

    const that = this
    const tar = event.target

    window.setTimeout(() => {
      if(tar.id === 'amount') {
        that._getDepositAmouont()
      } else if (tar.id === 'redeemAmount') {
        that._getWithdrawAmount()
      }
    }, 100)
  }

  inputKeyDown = (event) => {
    if (event.which === 13) {
      this.onInvest();
    }
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

  setAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const { asset } = this.props

    const balance = asset.balance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ amount: amount.toFixed(4) })

    const that = this

    window.setTimeout(() => {
      that._getDepositAmouont()
    }, 100)
  }

  setRedeemAmount = (percent) => {
    if(this.state.loading) {
      return
    }

    const balance = this.props.asset.scUSDBalance
    let amount = balance*percent/100
    amount = Math.floor(amount*10000)/10000;

    this.setState({ redeemAmount: amount.toFixed(4) })

    const that = this

    window.setTimeout(() => {
      that._getWithdrawAmount()
    }, 100)
  }

  _getDepositAmouont = () => {
    const { asset } = this.props;
    const { amount } = this.state

    //add more validation
    if(!amount) {
      return false
    }

    dispatcher.dispatch({ type: GET_DEPOSIT_AMOUNT, content: { asset: asset, amount: amount } })
  }

  _getWithdrawAmount = () => {
    const { asset } = this.props;
    const { redeemAmount } = this.state

    //add more validation
    if(!redeemAmount) {
      return false
    }

    dispatcher.dispatch({ type: GET_WITHDRAW_AMOUNT, content: { asset: asset, amount: redeemAmount } })
  }
}

export default withRouter(withStyles(styles, { withTheme: true })(Asset));
