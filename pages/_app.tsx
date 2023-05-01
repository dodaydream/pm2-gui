import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider } from '@mui/material/styles';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
    <CssVarsProvider defaultMode='system'>
      <CssBaseline />
      <Component {...pageProps} />
    </CssVarsProvider>
    </StyledEngineProvider>
  )
}
