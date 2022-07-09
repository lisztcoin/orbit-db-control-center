import React from 'react'
import {
  majorScale,
  minorScale,
  Pane,
  Text,
  StatusIndicator,
  Tab,
  TabNavigation
} from 'evergreen-ui'
import { useLocation } from 'react-router-dom'
import { initIPFS, initOrbitDB, getAllDatabases } from '../database'
import { actions, useStateValue } from '../state'

import ConnectToWalletButton from './ConnectToWalletButton'

function Systems () {
  const [appState, dispatch] = useStateValue()
  const location = useLocation();
  console.log(location.pathname);

  React.useEffect(() => {
    dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: true })

    initIPFS().then(async (ipfs) => {
      dispatch({ type: actions.SYSTEMS.SET_IPFS, ipfsStatus: 'Started' })

      initOrbitDB(ipfs).then(async (databases) => {
        dispatch({ type: actions.SYSTEMS.SET_ORBITDB, orbitdbStatus: 'Started' })

        const programs = await getAllDatabases()
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS, programs: programs.reverse() })
        dispatch({ type: actions.PROGRAMS.SET_PROGRAMS_LOADING, loading: false })
      })
    })
  }, [dispatch])

  return (
    <Pane background='white' elevation={1}>
      <Pane
        display='flex'
        flexDirection='row'
        alignItems='left'
        paddingX={majorScale(6)}
        paddingY={majorScale(1)}
      >
        <Pane display='flex' flexDirection='row' width='100%'>
          <TabNavigation>
          <Tab key="report" is="a" href="/#/report" id="report" isSelected={location.pathname === '/report'}>
            Report Daily Carbon Activities
            </Tab>
            <Tab key="rewards" is="a" href="/#/rewards" id="rewards" isSelected={location.pathname === '/rewards'}>
           Your Rewards
            </Tab>
        </TabNavigation>
          <ConnectToWalletButton style={{ marginLeft: 'auto' }} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Systems
