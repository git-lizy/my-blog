import Head from 'next/head'
import React,{useState,memo} from 'react'
import Container from '../components/Container'
import ArticleList from '../components/ArticleList'


export default function Home() {
	const [locationList,setLocationList]=useState([])

	return (
		<div className="container">
			<Container>
				<ArticleList/>
			</Container>
		</div>
	)
}
