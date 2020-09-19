import React from 'react'
import Detail from '../components/Detail'
import {withRouter} from 'next/router'


function Home(props) {
    return (
        <Detail key={props.router.asPath}/>
    )
}

export default withRouter(Home)
