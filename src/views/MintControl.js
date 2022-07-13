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
import { Contract, utils } from "ethers";
import { getDB } from '../database'
import { useStateValue, actions } from '../state'
import { useWeb3React } from '@web3-react/core'
import carbon_abi from '../abi/carbonnft.json'
import fs from 'fs'
import { NFTStorage, Blob } from 'nft.storage'

const endpoint = 'https://api.nft.storage' // the default
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzMUI4YjhiNjIwRjI0MWFiOTFiRTVhNTkyMzNiODdkNThFNThkOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDMxODE2Mjg3MCwibmFtZSI6ImtleSJ9.dOwpXNNx0Fl8bKOSRqJ-Sa0qfquuZDnY6OQBLJlBVU4"

function MintControl () {
    const [loading, setLoading] = React.useState(false)
    const [alreadyEntered, setAlreadyEntered] = React.useState(false)
    const [appState, dispatch] = useStateValue()
    const address = "/orbitdb/zdpuAxtE942sV37eizsbBhd8UpmfbNyBjVYWrRPL1jbgqqzzG/kv"
    const {active, account, library, connector, activate, deactivate } = useWeb3React()

    const fetchDB = async (address) => {
        setLoading(true)
        const db = await getDB(address)
    
        if (db) {
          let entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
          dispatch({ type: actions.DB.SET_DB, db, entries })
          setLoading(false)
        }
      }

      function mint() {
        mintForWinner()
      }

      const mintForWinner = async () => {
        const storage = new NFTStorage({ endpoint, token })
        // Upload NFT image using NFTStorage
        // Because we are using the same picture for simplicity, below code is commented out.
        // const data = await fs.promises.readFile('Tree.png')
        // const image_cid = await storage.storeBlob(new Blob([data]))
        // const status = await storage.status(image_cid)
      
        const image_cid = "bafybeiageaxl552cih6xj7te4reo7qhlpcorrgixuvozzlaqkelnhv4ubi"
        const image_url = "https://" + image_cid + ".ipfs.nftstorage.link/"
        
        const metadata = {
          "external_url": "https://www.carbonnft.art/",
          "image": image_url,
          "description": "CarbonNFT is a reward NFT for people who log their carbon footprint.",
          "name": "Carbon NFT #3"
        }
        const blob = new Blob([JSON.stringify(metadata, null, 2)], {type : 'application/json'});
        const metadata_cid = await storage.storeBlob(blob)
        console.log({ metadata_cid })
        const status = await storage.status(metadata_cid)
        console.log(status)

        const uri = "https://" + metadata_cid + ".ipfs.nftstorage.link/"
        const contract_address = "0xA5aE829B7dE6B0b3291C1fBe6A2DAce2d8044D1e"
        const carbon_contract = new Contract(contract_address, carbon_abi, library.getSigner(account));

        var participants = []
        appState.entries.map((e, idx) => {
            if (utils.isAddress(e.payload.value.key) && e.payload.value.value > 0) {
                participants.push(e.payload.value.key)
            }
        });
        
        carbon_contract.mint(participants, uri).then(
            () => {console.log("minted!");}
        ).catch(
            () => {console.log("error!");}
        )

        const db = appState.db
        for (let i = 0; i<participants.length; i++) {
            await db.del(participants[i])
        }
        const entries = Object.keys(db.all).map(e => ({ payload: { value: {key: e, value: db.get(e)} } }))
        dispatch({ type: actions.DB.SET_DB, db, entries })
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
        fetchDB(address)
        const program = appState.programs.find(p => p.payload.value.address === address)
        dispatch({ type: actions.PROGRAMS.SET_PROGRAM, program })
      }, [dispatch, appState.programs]) // eslint-disable-line

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
            Control Panel
          </Heading>
        </Pane>
        
        <Pane 
          display='flex' 
          flexDirection='column'
          marginX={majorScale(6)}
          marginTop={majorScale(2)}
          marginBottom={majorScale(1)}
        > 
          <Button
            iconBefore='document'
            appearance='default'
            height={24}
            width={80}
            onClick={mint}
          >
            Mint
          </Button>
        </Pane>
        
        </>
      )
}

export default MintControl