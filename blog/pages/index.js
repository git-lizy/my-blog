import Head from 'next/head'
import React,{useState,memo} from 'react'
import Container from '../components/Container'


export default function Home() {
	const [text,setText]=useState(0)
	return (
		<div className="container">
			<Container locations={[{label:'xx',path:'xxxx'},{label:'xx',path:'xxxx'},{label:'xx',path:'xxxx'}]}>
				<span onClick={()=>{setText(text+1)}}>{text}</span>
			</Container>
		</div>
	)
}
