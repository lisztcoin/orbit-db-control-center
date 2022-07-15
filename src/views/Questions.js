import React, { useEffect } from 'react'
import { 
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Checkbox,
  Spinner,
  Text
} from 'evergreen-ui'
import { getDB } from '../database'
import { useStateValue, actions } from '../state'
import { useWeb3React } from '@web3-react/core'
import { ORBIT_DB_ADDRESS } from '../config/constants'

function Questions () {
    const [loading, setLoading] = React.useState(false)
    const [alreadyEntered, setAlreadyEntered] = React.useState(false)
    const [appState, dispatch] = useStateValue()
    const {active, account, library, connector, activate, deactivate } = useWeb3React()

    const fetchDB = async () => {
        setLoading(true)
        const db = await getDB(ORBIT_DB_ADDRESS)
    
        if (db) {
          let entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
          dispatch({ type: actions.DB.SET_DB, db, entries })
          setLoading(false)
        }
      }

      function submitReport() {
        addToDB()
      }
    
      const addToDB = async () => {
        const db = appState.db
    
        if (db.type !== 'keyvalue') {
          throw new Error('This component can only handle Key-Value databases')
        }
    
        await db.set(account, Date.now())
    
        const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
        dispatch({ type: actions.DB.SET_DB, db, entries })
      }
    
      useEffect(() => {
        fetchDB(ORBIT_DB_ADDRESS)
        const program = appState.programs.find(p => p.payload.value.address === ORBIT_DB_ADDRESS)
        dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
      }, [dispatch, appState.programs]) // eslint-disable-line

      useEffect(() => {
        console.log(appState.entries)
        for (let entry of appState.entries) {
            let row = entry.payload.value
            if (row.key === account) {
                let date = new Date(row.value)
                let current = new Date()
                if (current.getFullYear() === date.getFullYear() && 
                    current.getMonth() === date.getMonth() &&
                    current.getDate() === date.getDate()) {
                        setAlreadyEntered(true);
                    }
                }
            }
      }, [appState.entries]);

      const [checked1, setChecked1] = React.useState(false)
      const [checked2, setChecked2] = React.useState(false)
      const [checked3, setChecked3] = React.useState(false)
    return (
        <>
        <Pane marginX={majorScale(6)}>
          <Heading
            fontFamily='Titillium Web'
            color='#425A70'
            size={700}
            textTransform='uppercase'
            marginTop={majorScale(3)}
            marginBottom={majorScale(2)}
          >
            Report Daily Carbon Activities
          </Heading>
        </Pane>
        
        <Pane 
          display='flex' 
          flexDirection='column'
          marginX={majorScale(6)}
          marginTop={majorScale(2)}
          marginBottom={majorScale(1)}
        > {alreadyEntered ? (<Text> Thanks for reporting! Please wait for the draw. Also don't forget to report tomorrow.</Text>) : (
            <>
            <Checkbox checked={checked1} onChange={e => setChecked1(e.target.checked)} label="I rode public transportation" />
            <Checkbox checked={checked2} onChange={e => setChecked2(e.target.checked)} label="I recycled something" />
            <Checkbox checked={checked3} onChange={e => setChecked3(e.target.checked)} label="I used my own cup for drinks" />
            
          <Button
            iconBefore='document'
            appearance='default'
            height={24}
            width={80}
            onClick={submitReport}
          >
            Submit
          </Button></>)}
        </Pane>
        </>
      )
}

export default Questions