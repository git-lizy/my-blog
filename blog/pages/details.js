import Head from 'next/head'
import React,{useState,memo} from 'react'
import Container from '../components/Container'
import Details from '../components/Details'


export default function Home() {
    return (
        <div className="container">
            <Container>
                <Details/>
            </Container>
        </div>
    )
}
