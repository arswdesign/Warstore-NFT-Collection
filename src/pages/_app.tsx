import { AppProps } from 'next/app'
import '../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Polygon} from "@thirdweb-dev/chains";

export default function App({
  Component, pageProps: { session, ...pageProps }
}: AppProps) {
   return (
      <ThirdwebProvider
        activeChain={ Polygon }
        autoConnect={true}>
        <ToastContainer autoClose={3000} />
        <Component {...pageProps}/>
      </ThirdwebProvider>
  )
}