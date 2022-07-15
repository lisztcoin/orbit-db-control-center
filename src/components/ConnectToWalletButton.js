import React, { useState, useEffect } from 'react'
import { Button } from 'evergreen-ui'
import { useWeb3React } from "@web3-react/core"
import { injected } from "../state/Connectors"
import {useEagerConnect} from "../state/web3"

function truncateAddress (address) {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

function ConnectToWalletButton (props) {

  const {active, account, library, connector, activate, deactivate } = useWeb3React()
  const triedEager = useEagerConnect()

  async function connect() {
    try {
      if (!active) {
        await activate(injected);
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <Button
      intent={account ? 'success' : 'none'}
      style={props.style}
      onClick={connect}
    >
      {account ? truncateAddress(account) : 'Connect wallet'}
    </Button>
  )
}

export default ConnectToWalletButton
