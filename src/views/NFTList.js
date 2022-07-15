import React, { useEffect, useState } from 'react'
import { 
  majorScale,
  minorScale,
  Button,
  Heading,
  Pane,
  Image,
  Checkbox,
  Spinner,
  Strong,
  Link,
  Text
} from 'evergreen-ui'
import { getDB } from '../database'
import { useStateValue, actions } from '../state'
import { Contract } from 'ethers'
import { CARBONNFT_CONTRACT, RUNNING_NETWORK } from '../config/constants'
import { useWeb3React } from '@web3-react/core'
import carbon_abi from '../abi/carbonnft.json'

function NFTList () {
    const [loading, setLoading] = React.useState(false)
    const [appState, dispatch] = useStateValue()
    const {active, account, library, connector, activate, deactivate } = useWeb3React()
    const [nftList, setNftList] = useState([])

    useEffect(() => {
        let stale = false;
        if (!!account && !!library) {
            console.log(account)
            console.log(library)
            const carbonnft_contract = new Contract(CARBONNFT_CONTRACT, carbon_abi, library.getSigner(account));
            carbonnft_contract.getAllTokensFromAddress(account).then(
                (tokens) => {
                    console.log(tokens)
                    if (!stale) {
                        setNftList(tokens);
                    }
                }
            ).catch(
                () => {
                    console.log("error retrieving carbon NFT")
                }
            );
            return () => {
                stale = true
                // do nothing.
            }
        }
        console.log(nftList);
    }, [account, library])

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
            Your Carbon NFT Collections
          </Heading>
        </Pane>
        
        <Pane clearfix
        > {nftList.length === 0 ? (<Text marginLeft={50}> You don't have any NFTs yet. Report your daily activity and wait for the lucky draw!</Text>) : (
            nftList.map((element) => { 
                return <NFTItem key={element.toNumber()} item_number={element.toNumber()} /> })
            )}
        </Pane>
        </>
      )
}

function NFTItem({item_number}) {
    return (
<Pane
    elevation={2}
    float="left"
    width={300}
    height={400}
    margin={24}
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
  >
    <img alt="" src='Tree.png' width={250}/>
    <Strong size={600}>Carbon NFT #{item_number}</Strong>
    <Link href={"https://testnets.opensea.io/assets/rinkeby/" + CARBONNFT_CONTRACT + "/" + item_number} marginRight={12} marginTop={5}>
    Opensea Link
  </Link>
  </Pane>
    );
}

export default NFTList