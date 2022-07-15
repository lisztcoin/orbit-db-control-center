import React from 'react'
import { Pane } from 'evergreen-ui'
import { Route, Switch } from 'react-router-dom'

import { actions, loadingState, StateProvider } from './state'

import Systems from './components/Systems'
import Header from './components/Header'

import DatabaseView from './views/Database'
import DatabasesView from './views/Databases'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import Questions from './views/Questions'
import MintControl from './views/MintControl'
import NFTList from './views/NFTList'

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App () {
  const initialState = {
    user: null,
    loginDialogOpen: false,
    createDBDialogOpen: false,
    addDBDialogOpen: false,
    programs: [],
    program: false,
    db: null,
    entries: [],
    orbitdbStatus: 'Starting',
    ipfsStatus: 'Starting',
    loading: {
      programs: false
    }
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case actions.SYSTEMS.SET_ORBITDB:
        return {
          ...state,
          orbitdbStatus: action.orbitdbStatus
        }
      case actions.SYSTEMS.SET_IPFS:
        return {
          ...state,
          ipfsStatus: action.ipfsStatus
        }
      case actions.PROGRAMS.SET_PROGRAM:
        return {
          ...state,
          program: action.program
        }
      case actions.PROGRAMS.SET_PROGRAM_LOADING:
        return {
          ...state,
          program: loadingState
        }
      case actions.PROGRAMS.SET_PROGRAMS:
        return {
          ...state,
          programs: action.programs
        }
      case actions.DB.SET_DB:
        return {
          ...state,
          db: action.db,
          entries: action.entries,
        }
      case actions.DB.OPEN_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: true
        }
      case actions.DB.CLOSE_CREATEDB_DIALOG:
        return {
          ...state,
          createDBDialogOpen: false
        }
      case actions.DB.OPEN_ADDDB_DIALOG:
        return {
          ...state,
          addDBDialogOpen: true
        }
      case actions.DB.CLOSE_ADDDB_DIALOG:
        return {
          ...state,
          addDBDialogOpen: false
        }
      case actions.PROGRAMS.SET_PROGRAMS_LOADING:
        return {
          ...state,
          loading: { ...state.loading, programs: action.loading }
        }
      default:
        return state
    }
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <Pane background='tint1' height='100%'>
          <Header />
          <Systems />
          <Switch>
            <Route path='/orbitdb/:programName/:dbName'>
              <DatabaseView />
            </Route>
            <Route path='/secret'>
              <DatabasesView />
            </Route>
            <Route path='/mintcontrol'>
              <MintControl />
            </Route>
            <Route path='/report'>
              <Questions />
            </Route>
            <Route path='/rewards'>
              <NFTList />
            </Route>
          </Switch>
        </Pane>
      </StateProvider>
    </Web3ReactProvider>
  )
}

export default App
