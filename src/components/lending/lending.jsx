import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  TextField,
  MenuItem,
  Button,
} from '@material-ui/core';
import { colors } from '../../theme'

import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES,
  BALANCES_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
  GET_REPAY_AMOUNT,
  REPAY_AMOUNT_RETURNED,
  GET_BORROW_AMOUNT,
  BORROW_AMOUNT_RETURNED,
  REPAY,
  REPAY_RETURNED,
  BORROW,
  BORROW_RETURNED,
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
  },
  between: {
    width: '24px'
  },
  portfolioContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '40px'
  },
  titleBalance: {
    padding: '20px 10px',
    borderRadius: '50px',
    border: '1px solid '+colors.borderBlue,
    background: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
});

class Lending extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')

    this.state = {
      assets: store.getStore('assets'),
      scAsset: store.getStore('scAsset'),
      account: account,
      repayAmount: '',
      repayAsset: '',
      borrowAmount: '',
      borrowAsset: '',
      loading: false,
      activeTab: 'borrow',
      calculatedRepayAmount: null,
      calculatedBorrowAmount: null
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
    emitter.on(REPAY_AMOUNT_RETURNED, this.repayAmountReturned);
    emitter.on(BORROW_AMOUNT_RETURNED, this.borrowAmountReturned);
    emitter.on(REPAY_RETURNED, this.repayReturned);
    emitter.on(BORROW_RETURNED, this.borrowReturned);
  }

  componentWillUnmount() {
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(BALANCES_RETURNED, this.balancesReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(REPAY_AMOUNT_RETURNED, this.repayAmountReturned);
    emitter.removeListener(BORROW_AMOUNT_RETURNED, this.borrowAmountReturned);
    emitter.removeListener(REPAY_RETURNED, this.repayReturned);
    emitter.removeListener(BORROW_RETURNED, this.borrowReturned);
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
      scAsset: store.getStore('scAsset'),
    })
  };

  repayAmountReturned = (amount) => {
    if(amount.sendAmount === this.state.repayAmount) {
      this.setState({
        calculatedRepayAmount: amount
      })
    }
  }

  borrowAmountReturned = (amount) => {
    console.log(amount)
    if(amount.sendAmount === this.state.borrowAmount) {
      this.setState({
        calculatedBorrowAmount: amount
      })
    }
  }

  repayReturned = () => {
    this.setState({
      loading: false,
      repayAsset: '',
      repayAmount: ''
    })
  }

  borrowReturned = () => {
    this.setState({
      loading: false,
      borrowAsset: '',
      borrowAmount: ''
    })
  }

  errorReturned = (error) => {
    this.setState({ loading: false })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      activeTab,
      scAsset
    } = this.state

    if(!account || !account.address) {
      return (<div></div>)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.portfolioContainer }>
          <div className={ classes.titleBalance }>
            <Typography variant={ 'h2' } noWrap>$ { scAsset.depositedBalance.toFixed(2) }</Typography>
            <Typography variant={ 'h4' } className={ classes.gray }>Collateral</Typography>
          </div>
          <div className={ classes.between }>
          </div>
          <div className={ classes.titleBalance }>
            <Typography variant={ 'h2' } noWrap>$ { scAsset.balance.toFixed(2) }</Typography>
            <Typography variant={ 'h4' } className={ classes.gray }>Credit available</Typography>
          </div>
          <div className={ classes.between }>
          </div>
          <div className={ classes.titleBalance }>
            <Typography variant={ 'h2' } noWrap>$ { scAsset.balance > scAsset.creditBalance ? '0.00' : (scAsset.creditBalance - scAsset.balance).toFixed(2) }</Typography>
            <Typography variant={ 'h4' } className={ classes.gray }>Borrowed</Typography>
          </div>
        </div>
        <div className={ classes.inputContainer }>
          <div className={ classes.toggleContainer }>
            <Typography variant='h3' className={ activeTab === 'borrow' ? classes.toggleHeadingActive : classes.toggleHeading } onClick={ () => { this.toggleBorrow() }}>Borrow</Typography>
            <Typography variant='h3' className={ activeTab === 'repay' ? classes.toggleHeadingActive : classes.toggleHeading } onClick={ () => { this.toggleRepay() }}>Repay</Typography>
          </div>
          {
            activeTab === 'borrow' && this.renderBorrow()
          }
          {
            activeTab === 'repay' && this.renderRepay()
          }
        </div>
        { loading && <Loader /> }
      </div>
    )
  };

  renderRepay = () => {
    const { classes } = this.props;
    const {
      loading,
      repayAmount,
      repayAsset,
    } = this.state

    return (
      <React.Fragment>
        { this.renderAssetInput('repay') }
        { this.renderRepayPrice() }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || repayAmount === '' || !repayAsset }
          onClick={ this.onRepay }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h4'} color='secondary'>{ !repayAsset && 'Select repay asset' }{ (repayAsset && repayAmount === '') && 'Enter repay amount' }{ (repayAsset && repayAmount !== '') && 'Repay' }</Typography>
        </Button>
      </React.Fragment>
    )
  }

  renderBorrow = () => {
    const { classes } = this.props;
    const {
      loading,
      borrowAmount,
      borrowAsset,
    } = this.state

    return (
      <React.Fragment>
        { this.renderAssetInput('borrow') }
        { this.renderBorrowPrice() }
        <Button
          className={ classes.actionButton }
          variant="outlined"
          color="primary"
          disabled={ loading || borrowAmount === '' || !borrowAsset }
          onClick={ this.onBorrow }
          fullWidth
          >
          <Typography className={ classes.buttonText } variant={ 'h4'} color='secondary'>{ !borrowAsset && 'Select borrow asset' }{ (borrowAsset && borrowAmount === '') && 'Enter borrow amount' }{ (borrowAsset && borrowAmount !== '') && 'Borrow' }</Typography>
        </Button>
      </React.Fragment>
    )
  }

  renderRepayPrice = () => {

    const {
      classes
    } = this.props
    const {
      calculatedRepayAmount,
      repayAsset
    } = this.state

    if(!calculatedRepayAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `scUSD per ${repayAsset}` }</Typography>
          <Typography variant='h3' >{ calculatedRepayAmount ? calculatedRepayAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>You repay scUSD</Typography>
          <Typography variant='h3' >{ calculatedRepayAmount ? calculatedRepayAmount.returnPrice.toFixed(4) : '-' }</Typography>
        </div>
      </div>
    )
  }

  renderBorrowPrice = () => {

    const {
      classes
    } = this.props
    const {
      calculatedBorrowAmount,
      borrowAsset
    } = this.state

    if(!calculatedBorrowAmount) {
      return (<div></div>)
    }

    return (
      <div className={ classes.priceContainer }>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>{ `scUSD per ${borrowAsset}` }</Typography>
          <Typography variant='h3' >{ calculatedBorrowAmount ? calculatedBorrowAmount.receivePerSend.toFixed(4) : '-' }</Typography>
        </div>
        <div className={ classes.priceConversion }>
          <Typography variant='h4' className={ classes.conversionDirection }>You pay scUSD</Typography>
          <Typography variant='h3' >{ calculatedBorrowAmount ? calculatedBorrowAmount.returnPrice.toFixed(4) : '-' }</Typography>
        </div>
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
              { type === 'repay' && 'You send' }
              { type === 'borrow' && 'I want to borrow' }
            </Typography>
          </div>
          <div className={ classes.balances }>
            { type === 'borrow' && (asset ? (<Typography variant='h4' onClick={ () => { this.setAmount(asset.id, 'borrow', (asset ? asset.scUSDBalance : 0)) } } className={ classes.value } noWrap>{ 'Available: '+ ( asset && asset.scUSDBalance ? (Math.floor(asset.scUSDBalance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Available: -</Typography>) }
            { type === 'repay' && (asset ? (<Typography variant='h4' onClick={ () => { this.setAmount(asset.id, type, (asset ? asset.balance : 0)) } } className={ classes.value } noWrap>{ 'Balance: '+ ( asset && asset.balance ? (Math.floor(asset.balance*10000)/10000).toFixed(4) : '0.0000') } { asset ? asset.symbol : '' }</Typography>) : <Typography variant='h4' className={ classes.value } noWrap>Balance: -</Typography>) }
          </div>
        </div>
        <div>
          <TextField
            fullWidth
            disabled={ loading }
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
            { id === 'repayAsset' && <Typography variant='h4'>{ option.balance ? option.balance.toFixed(2) : '0.00' } { option.symbol }</Typography> }
            { id === 'borrowAsset' && <Typography variant='h4'>{ option.scUSDBalance ? option.scUSDBalance.toFixed(2) : '0.00' } { option.symbol }</Typography> }
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
      if(tar.id === 'repayAmount') {
        that._getRepayAmouont()
      } else if (tar.id === 'borrowAmount') {
        that._getBorrowAmount()
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
      if(tar.name === 'repayAsset') {
        that._getRepayAmouont()
      } else if (tar.name === 'borrowAsset') {
        that._getBorrowAmount()
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
      if(type === 'repay') {
        that._getRepayAmouont()
      } else if (type === 'borrow') {
        that._getBorrowAmount()
      }
    }, 100)
  }

  toggleRepay = () => {
    this.setState({ activeTab: 'repay', repayAmount: '', repayAsset: '', receiveAmount: '', calculatedRepayAmount: null })
  }

  toggleBorrow = () => {
    this.setState({ activeTab: 'borrow', borrowAmount: '', borrowAsset: '', calculatedBorrowAmount: null })
  }

  _getRepayAmouont = () => {
    const {
      repayAsset,
      repayAmount,
      assets
   } = this.state

    //add more validation
    if(!repayAsset || !repayAmount) {
      return false
    }

    let asset = assets.filter((a) => {
      return a.id === repayAsset
    })[0]

    dispatcher.dispatch({ type: GET_REPAY_AMOUNT, content: { asset: asset, amount: repayAmount } })
  }

  _getBorrowAmount = () => {
    const {
      borrowAsset,
      borrowAmount,
      assets
    } = this.state

    //add more validation
    if(!borrowAsset || !borrowAmount) {
      return false
    }

    let asset = assets.filter((a) => {
      return a.id === borrowAsset
    })[0]

    dispatcher.dispatch({ type: GET_BORROW_AMOUNT, content: { asset: asset, amount: borrowAmount } })
  }

  onRepay = () => {
    const {
      repayAsset,
      repayAmount,
      assets
    } = this.state

    //add more validation
    if(!repayAsset || !repayAmount) {
      return false
    }

    let asset = assets.filter((a) => {
      return a.id === repayAsset
    })[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: REPAY, content: { asset: asset, amount: repayAmount } })
  }

  onBorrow = () => {
    const {
      borrowAsset,
      borrowAmount,
      assets
    } = this.state

    //add more validation
    if(!borrowAsset || !borrowAmount) {
      return false
    }

    let asset = assets.filter((a) => {
      return a.id === borrowAsset
    })[0]

    this.setState({ loading: true })
    dispatcher.dispatch({ type: BORROW, content: { asset: asset, amount: borrowAmount } })
  }
}

export default withRouter(withStyles(styles)(Lending));
