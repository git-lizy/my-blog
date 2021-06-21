import './global.scss'
import 'antd/dist/antd.min.css'
import React, { useEffect } from 'react'
import {Provider} from 'react-redux'
import Store from '../store/store'
import Container from '../components/Container'


function App({Component, pageProps}) {
    return <Provider store={Store}>
        <Container>
            <Component {...pageProps} />
        </Container>
    </Provider>
}

export default (App)
