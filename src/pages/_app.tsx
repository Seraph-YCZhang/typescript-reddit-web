import { ChakraProvider } from '@chakra-ui/core';
import { AppProps } from 'next/app';
import React from 'react';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider resetCSS>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
