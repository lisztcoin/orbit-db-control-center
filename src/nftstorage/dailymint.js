
import fs from 'fs'
import { NFTStorage, Blob } from 'nft.storage/dist/bundle.esm.min.js'

const endpoint = 'https://api.nft.storage' // the default
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMzMUI4YjhiNjIwRjI0MWFiOTFiRTVhNTkyMzNiODdkNThFNThkOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMDMxODE2Mjg3MCwibmFtZSI6ImtleSJ9.dOwpXNNx0Fl8bKOSRqJ-Sa0qfquuZDnY6OQBLJlBVU4" // your API key from https://nft.storage/manage

async function main() {
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
    "name": "Carbon NFT #1"
  }
  const blob = new Blob([JSON.stringify(metadata, null, 2)], {type : 'application/json'});
  const metadata_cid = await storage.storeBlob(blob)
  console.log({ metadata_cid })
  const status = await storage.status(metadata_cid)
  console.log(status)


}
main()
