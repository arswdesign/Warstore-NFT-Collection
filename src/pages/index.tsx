import Head from 'next/head'
import styles from '../styles/home.module.scss'
import { useEffect, useState } from 'react'
import { ConnectWallet, useAddress, useSwitchChain, useNetworkMismatch, ChainId, useContract, MediaRenderer, useNFT, useNFTs, useChainId, useSDK } from "@thirdweb-dev/react"
import { toast } from 'react-toastify'
import { NextPageContext } from 'next'

const Home: NextPage = () => {
  
  const address = useAddress()
  const [loading, setLoading] = useState(true)
  const [loadingMint, setLoadingMint] = useState(false)
  const [minted, setMinted] = useState(0)
  const [amount, setAmount] = useState(1)
  const switchChain = useSwitchChain()
  const isMismatched = useNetworkMismatch()
  const nameProjet = "Warstore Collection"  // Nome do seu Projeto
  const { contract } = useContract("0xC36e9F4E8bfAFd462DD2C8d834e23618cB81839d") // Endereço da sua Coleção    

  //const [nfts, setNFTs] = useState('');
  async function getDataTokens(){
      const { data: nftsGet, isLoading, error } = useNFTs(contract);
      return nftsGet;
  }

  
  const [nfts, setNFTs] = useState('');
  const getData = getDataTokens()
  if(loading){
    {getData.then(res => {
      if(res){
        if(loading){
          setNFTs(res);
          setLoading(false)
          console.log(nfts)
        }
      }
    })}
  }

  async function totalMinted(token){
    const data = await (await contract)?.call("totalSupply", [token])
    .then(function(myValue: any){
      const minted = myValue.toString()
      setMinted(myValue)
      document.getElementById("p"+token).innerHTML = minted+" Minted"
      console.log("total:"+minted)


    }).catch(function(error: any){
      console.log(error)
    })

  }

  async function claim(token){
    
    setLoadingMint(token)

    if(!address){
      toast.error('Connect your wallet')
      setLoadingMint(false)
      return
    }

  
    const tx = await contract?.erc1155.claim(token, amount)
    .then(function(myValue: any){
      const receipt = myValue 
      totalMinted(token)
      toast.success(`Congrats! Your NFT was minted successfuly.`)

    }).catch(function(error: any){
      console.log(error)
      toast.error("Ops! We can't mint your NFT")
    })
    setLoadingMint(false)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>{nameProjet}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta content="#000000" name="theme-color"></meta>
      </Head>
      <main className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <h1>Warstore NFT Collection</h1>
        </div>

        <div className={styles.walletContainer}>
          { address && isMismatched ?
            <button onClick={ () => switchChain(ChainId.Mumbai)} className={styles.btnChain}>Switch Chain</button>
          : 
            <ConnectWallet modalTitle="Connect Wallet | Login" btnTitle='Connect Wallet&nbsp;&nbsp;|&nbsp;&nbsp;Login' className={styles.btn}  />
          }
        </div>
        <div className={styles.mainGrid}>
          
          {!nfts?
                  <div className={styles.loading}>
                    <svg className={styles.spinner} width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                      <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                    </svg>
                  </div> 
                :
                <>
            {nfts.map(token => {
              if(token.metadata.id>1){
                return(
                  <div className={styles.claimContainer} key={token.metadata.id}>
              
                    <div className={styles.infoContainer}>
                      <MediaRenderer 
                        src={token.metadata.image}
                        alt="NFT Imagem"
                        className={styles.media}
                      />
                      <p id={"p"+token.metadata.id}>{token.supply} Minted</p>
                      <p>{token.metadata.name}</p>
                      <span>{token.metadata.description}</span>
                      <div id={"mtc"+token.metadata.id} className={styles.mintContainer}>
                      { loadingMint === token.metadata.id?
                      <div className={styles.btnLoadMint}>
                        <div className={styles.loading}>
                          <svg className={styles.spinner} width="30px" height="30px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                            <circle className={styles.path} fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
                          </svg>
                        </div> 
                      </div>
                      :
                        <button className={styles.btnMint} onClick={() => claim(token.metadata.id) }>Mint Now</button>
                      }
                      </div>
                    </div>
                  
                  </div>
                )
              }
            })}
            </>
            
          }
          <div className={styles.clr}></div>
        </div>
        <footer>
          <p>Copyrights © {nameProjet} 2023&nbsp;&nbsp;|&nbsp;&nbsp;   <a className={styles.link} href='https://camisetas.warstore.com.br' target='_blank'>warstore.com.br</a></p>
        </footer>
      </main>      
    </div>
  )
}
export default Home;
