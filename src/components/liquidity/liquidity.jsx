import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress
} from '@material-ui/core';
import { colors } from '../../theme'

import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_DEPOSIT_AMOUNT,
  DEPOSIT_AMOUNT_RETURNED,
  GET_WITHDRAW_AMOUNT,
  WITHDRAW_AMOUNT_RETURNED,
  DEPOSIT,
  DEPOSIT_RETURNED,
  WITHDRAW,
  WITHDRAW_RETURNED,
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
    maxWidth: '1200px',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    display: 'flex',
    padding: '30px',
    borderRadius: '50px',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    margin: '40px 0px',
    border: '1px solid '+colors.borderBlue,
    minWidth: '500px',
    background: colors.white
  },
  inputCardHeading: {
    width: '100%',
    color: colors.darkGray,
    paddingLeft: '12px'
  },
  valContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '24px'
  },
  balances: {
    textAlign: 'right',
    paddingRight: '20px',
    cursor: 'pointer'
  },
  assetSelectMenu: {
    padding: '15px 15px 15px 20px',
    minWidth: '300px',
    display: 'flex'
  },
  assetSelectIcon: {
    display: 'inline-block',
    verticalAlign: 'middle',
    borderRadius: '25px',
    background: '#dedede',
    height: '30px',
    width: '30px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  assetSelectIconName: {
    paddingLeft: '10px',
    display: 'inline-block',
    verticalAlign: 'middle',
    flex: 1
  },
  assetSelectBalance: {
    paddingLeft: '24px'
  },
  assetAdornment: {
    color: colors.text + ' !important'
  },
  assetContainer: {
    minWidth: '120px'
  },
  actionButton: {
    '&:hover': {
      backgroundColor: "#2F80ED",
    },
    marginTop: '24px',
    padding: '12px',
    backgroundColor: "#2F80ED",
    borderRadius: '1rem',
    border: '1px solid #E1E1E1',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      padding: '15px',
    }
  },
  buttonText: {
    fontWeight: '700',
    color: 'white',
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    background: '#dedede',
    borderRadius: '24px',
    padding: '24px'
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
  toggleContainer: {
    width: '100%',
    display: 'flex',
  },
  toggleHeading: {
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '24px',
    color: colors.darkGray
  },
  toggleHeadingActive: {
    flex: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '24px',
    color: colors.text
  },
  flexy: {
    width: '100%',
    display: 'flex'
  },
  label: {
    flex: 1,
    paddingLeft: '12px'
  }
});

class Liquidity extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('assets'),
      scAsset: store.getStore('scAsset'),
      account: account,
      depositAmount: '',
      depositAsset: '',
      withdrawAmount: '',
      receiveAmount: '',
      receiveAsset: '',
      loading: false,
      activeTab: 'deposit',
      calculatedDepositAmount: null,
      calculatedWithdrawAmount: null
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
    emitter.on(DEPOSIT_AMOUNT_RETURNED, this.depositAmountReturned);
    emitter.on(WITHDRAW_AMOUNT_RETURNED, this.withdrawAmountReturned);
    emitter.on(DEPOSIT_RETURNED, this.depositReturned);
    emitter.on(WITHDRAW_RETURNED, this.withdrawReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(DEPOSIT_AMOUNT_RETURNED, this.depositAmountReturned);
    emitter.removeListener(WITHDRAW_AMOUNT_RETURNED, this.withdrawAmountReturned);
    emitter.removeListener(DEPOSIT_RETURNED, this.depositReturned);
    emitter.removeListener(WITHDRAW_RETURNED, this.withdrawReturned);
  };

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES, content: {} })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  balancesReturned = (balances) => {
    this.setState({
      assets: store.getStore('assets'),
      scAsset: store.getStore('scAsset')
    })
  };

  depositAmountReturned = (amount) => {
    if(amount.sendAmount === this.state.depositAmount) {
      this.setState({
        calculatedDepositAmount: amount
      })
    }
  }

  withdrawAmountReturned = (amount) => {
    console.log(amount)
    if(amount.sendAmount === this.state.withdrawAmount) {
      this.setState({
        calculatedWithdrawAmount: amount,
        receiveAmount: amount.returnPrice
      })
    }
  }

  depositReturned = () => {
    this.setState({ loading: false })
  }

  withdrawReturned = () => {
    this.setState({ loading: false })
  }

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      depositAmount,
      depositAsset,
      activeTab
    } = this.state

    if(!account || !account.address) {
      return (<div></div>)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.inputContainer }>
          <div className={ classes.toggleContainer }>
            <Typography variant='h3' className={ activeTab === 'deposit' ? classes.toggleHeadingActive : classes.toggleHeading } onClick={ () => { this.toggleDeposit() }}>Deposit</Typography>
            <Typography variant='h3' className={ activeTab === 'withdraw' ? classes.toggleHeadingActive : classes.toggleHeading } onClick={ () => { this.toggleWithdraw() }}>Withdraw</Typography>
          </div>
          {
            activeTab === 'deposit' && this.renderDeposit()
          }
          {
            activeTab === 'withdraw' && this.renderWithdraw()
          }
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  renderDeposit = () => {
    const { classes } = this.props;
    const {
      loading,
      depositAmount,
      depositAsset,
    } = this.state

    return (
      <React.Fragment>
        { this.renderAssetInput('deposit') }
        { this.renderReceive() }
        { this.renderDepositPrice() }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || depositAmount === '' || !depositAsset }
          onClick={ this.onDeposit }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h4'} color='secondary'>{ !depositAsset && 'Select deposit asset' }{ (depositAsset && depositAmount === '') && 'Enter deposit amount' }{ (depositAsset && depositAmount !== '') && 'Deposit' }</Typography>
        </Button>
      </React.Fragment>
    )
  }

  renderWithdraw = () => {
    const { classes } = this.props;
    const {
      loading,
      withdrawAmount,
      receiveAsset,
    } = this.state

    return (
      <React.Fragment>
        { this.renderWithdrawAsset() }
        { this.renderAssetInput('receive') }
        { this.renderWithdrawPrice() }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || withdrawAmount === '' || !receiveAsset }
          onClick={ this.onWithdraw }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h4'} color='secondary'>{ !receiveAsset && 'Select withdraw asset' }{ (receiveAsset && withdrawAmount === '') && 'Enter withdraw amount' }{ (receiveAsset && withdrawAmount !== '') && 'Withdraw' }</Typography>
        </Button>
      </React.Fragment>
    )
  }

  renderWithdrawAsset = () => {
    const {
      classes
    } = this.props
    const {
      loading,
      withdrawAmount,
      withdrawAmountError,
      receiveAsset,
      assets
    } = this.state

    const that = this

    let asset = assets.filter((asset) => { return asset.id === receiveAsset })
    if(asset.length > 0) {
      asset = asset[0]
    } else {
      asset = null
    }

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.flexy }>
          <div className={ classes.label }>
            <Typography variant='h4'>You withdraw</Typography>
          </div>
          <div className={ classes.balances }>
            { (asset ? (<Typography variant='h4' onClick={ () => { this.setAmount(asset.id, 'withdraw', (asset ? asset.depositedBalance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.depositedBalance ? (Math.floor(asset.depositedBalance*10000)/10000).toFixed(4) : '0.0000') } scUSD</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Balance: -</Typography>) }
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
            className={ classes.actionInput }
            id={ "withdrawAmount" }
            value={ withdrawAmount }
            error={ withdrawAmountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <div className={ classes.assetAdornment }>scUSD</div>,
            }}
          />
        </div>
      </div>
    )
  }

  renderReceive = () => {
    const {
      classes
    } = this.props
    const {
      loading,
      calculatedDepositAmount,
      depositAmount,
      scAsset
    } = this.state

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.flexy }>
          <div className={ classes.label }>
            <Typography variant='h4'>You receive</Typography>
          </div>
          <div className={ classes.balances }>
            { (scAsset ? (<Typography variant='h4' onClick={ () => { this.setAmount(scAsset.id, 'receive', (scAsset ? scAsset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( scAsset && scAsset.balance ? (Math.floor(scAsset.balance*10000)/10000).toFixed(4) : '0.0000') } { scAsset ? scAsset.symbol : '' }</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Balance: -</Typography>) }
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ true }
            className={ classes.actionInput }
            id={ "receiveAmount" }
            value={ calculatedDepositAmount ? calculatedDepositAmount.returnPrice : '' }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <div className={ classes.assetAdornment }>scUSD</div>,
            }}
          />
        </div>
      </div>
    )
  }

  renderDepositPrice = () => {

    const {
      classes
    } = this.props
    const {
      loading,
      calculatedDepositAmount,
      depositAsset
    } = this.state

    if(!calculatedDepositAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `scUSD per ${depositAsset}` }</Typography>
          <Typography variant='h3' >{ calculatedDepositAmount ? calculatedDepositAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `${depositAsset} per scUSD` }</Typography>
          <Typography variant='h3' >{ calculatedDepositAmount ? calculatedDepositAmount.sendPerReceive.toFixed(4) : '-' }</Typography>
        </div>
      </div>
    )
  }

  renderWithdrawPrice = () => {

    const {
      classes
    } = this.props
    const {
      loading,
      calculatedWithdrawAmount,
      receiveAsset
    } = this.state

    if(!calculatedWithdrawAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        { loading && <CircularProgress size={ 20 } /> }
        { !loading &&
          <div className={ classes.priceConversion }>
            <Typography variant='h4' className={ classes.conversionDirection }>{ `${receiveAsset} per scUSD` }</Typography>
            <Typography variant='h3' >{ calculatedWithdrawAmount ? calculatedWithdrawAmount.receivePerSend.toFixed(4) : '-' }</Typography>
          </div>
        }
        { !loading &&
          <div className={ classes.priceConversion }>
            <Typography variant='h4' className={ classes.conversionDirection }>{ `scUSD per ${receiveAsset}` }</Typography>
            <Typography variant='h3' >{ calculatedWithdrawAmount ? calculatedWithdrawAmount.sendPerReceive.toFixed(4) : '-' }</Typography>
          </div>
        }
      </div>
    )
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderAssetInput = (type) => {
    const {
      classes
    } = this.props

    const {
      loading,
      assets
    } = this.state

    const that = this

    let asset = assets.filter((asset) => { return asset.id === that.state[type+"Asset"] })
    if(asset.length > 0) {
      asset = asset[0]
    } else {
      asset = null
    }

    const amount = this.state[type+"Amount"]
    const amountError = this.state[type+'AmountError']

    return (
      <div className={ classes.valContainer }>
        <div className={ classes.flexy }>
          <div className={ classes.label }>
            <Typography variant='h4'>
              { type === 'deposit' && 'You send' }
              { type === 'receive' && 'You receive' }
            </Typography>
          </div>
          <div className={ classes.balances }>
            { type === 'deposit' && (asset ? (<Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Balance: -</Typography>) }
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading || type === 'receive' }
            className={ classes.actionInput }
            id={ type+"Amount" }
            value={ amount }
            error={ amountError }
            onChange={ this.onChange }
            placeholder="0.00"
            variant="outlined"
            InputProps={{
              endAdornment: <div className={ classes.assetContainer }>{ this.renderAssetSelect(type+"Asset") }</div>,
            }}
          />
        </div>
      </div>
    )
  }

  renderAssetSelect = (id) => {
    const { loading, assets } = this.state
    const { classes } = this.props

    return (
      <TextField
        id={ id }
        name={ id }
        select
        value={ this.state[id] }
        onChange={ this.onSelectChange }
        SelectProps={{
          native: false,
          renderValue: (option, a, b) => {
            return (
              <React.Fragment>
                <div className={ classes.assetSelectIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/tokens/'+option+'-logo.png') }
                    height="30px"
                  />
                </div>
                <div className={ classes.assetSelectIconName }>
                  <Typography variant='h4'>{ option }</Typography>
                </div>
              </React.Fragment>
            )
          }
        }}
        fullWidth
        disabled={ loading }
        placeholder={ 'Select' }
        className={ classes.assetSelectRoot }
      >
        { assets ? assets.map((asset) => { return this.renderAssetOption(asset, id) }) : null }
      </TextField>
    )
  }

  renderAssetOption = (option, id) => {
    const { classes } = this.props

    return (
      <MenuItem key={option.id} value={option.symbol} className={ classes.assetSelectMenu }>
        <React.Fragment>
          <div className={ classes.assetSelectIcon }>
            <img
              alt=""
              src={ require('../../assets/tokens/'+option.id+'-logo.png') }
              height="30px"
            />
          </div>
          <div className={ classes.assetSelectIconName }>
            <Typography variant='h4'>{ option.symbol }</Typography>
          </div>
          <div className={ classes.assetSelectBalance }>
            { id === 'depositAsset' && <Typography variant='h4'>{ option.balance ? option.balance.toFixed(2) : '0.00' } { option.symbol }</Typography> }
            { id === 'receiveAsset' && <Typography variant='h4'>{ option.scUSDBalance ? option.scUSDBalance.toFixed(2) : '0.00' } scUSD</Typography> }
          </div>
        </React.Fragment>
      </MenuItem>
    )
  }

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.value
    this.setState(val)

    const that = this
    const tar = event.target

    window.setTimeout(() => {
      if(tar.id === 'depositAmount') {
        that._getDepositAmouont()
      } else if (tar.id === 'withdrawAmount') {
        that._getWithdrawAmount()
      }
    }, 100)
  }

  onSelectChange = (event) => {
    let val = []
    val[event.target.name] = event.target.value
    this.setState(val)

    const that = this
    const tar = event.target

    window.setTimeout(() => {
      if(tar.name === 'depositAsset') {
        that._getDepositAmouont()
      } else if (tar.name === 'receiveAsset') {
        that._getWithdrawAmount()
      }
    }, 100)
  }

  setAmount = (id, type, balance) => {
    const bal = (Math.floor((balance === '' ? '0' : balance)*10000)/10000).toFixed(4)
    let val = []
    val[type+"Amount"] = bal
    this.setState(val)

    const that = this
    window.setTimeout(() => {
      if(type === 'deposit') {
        that._getDepositAmouont()
      } else if (type === 'receive') {
        that._getWithdrawAmount()
      }
    }, 100)
  }

  toggleDeposit = () => {
    this.setState({ activeTab: 'deposit', depositAmount: '', depositAsset: '', receiveAmount: '', calculatedDepositAmount: null })
  }

  toggleWithdraw = () => {
    this.setState({ activeTab: 'withdraw', withdrawAmount: '', receiveAsset: '', receiveAmount: '', calculatedWithdrawAmount: null })
  }

  _getDepositAmouont = () => {
    const { depositAsset, depositAmount } = this.state

    //add more validation
    if(!depositAsset || !depositAmount) {
      return false
    }

    dispatcher.dispatch({ type: GET_DEPOSIT_AMOUNT, content: { asset: depositAsset, amount: depositAmount } })
  }

  _getWithdrawAmount = () => {
    const { receiveAsset, withdrawAmount } = this.state

    //add more validation
    if(!receiveAsset || !withdrawAmount) {
      return false
    }

    dispatcher.dispatch({ type: GET_WITHDRAW_AMOUNT, content: { asset: receiveAsset, amount: withdrawAmount } })
  }

  onDeposit = () => {
    const { depositAsset, depositAmount } = this.state

    //add more validation
    if(!depositAsset || !depositAmount) {
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: DEPOSIT, content: { asset: depositAsset, amount: depositAmount } })
  }

  onWithdraw = () => {
    const { receiveAsset, withdrawAmount } = this.state

    //add more validation
    if(!receiveAsset || !withdrawAmount) {
      return false
    }

    this.setState({ loading: true })
    dispatcher.dispatch({ type: WITHDRAW, content: { asset: receiveAsset, amount: withdrawAmount } })
  }
}

export default withRouter(withStyles(styles)(Liquidity));
