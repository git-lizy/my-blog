import Head from 'next/head'
import React,{useState,memo} from 'react'
import Container from '../components/Container'
import Detail from '../components/Detail'
import {withRouter} from 'next/router'


 function Home(props) {
    return (
        <div className="container">
            <Container>
                <Detail key={props.router.asPath}/>
            </Container>
        </div>
    )
}
export default withRouter(Home)
