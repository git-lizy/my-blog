import React,{useState} from 'react'
import Header from '../Header'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import { Row , Col ,} from 'antd'
import './style.scss'

function Container(props) {
	return <>
		<Header/>
		<NavBar/>
		<Row  className={'containerMainRow'}>
			<Col xs={24} sm={24} md={19}></Col>
			<Col xs={0} sm={0} md={5}>
				<SideBar/>
			</Col>
		</Row>
	</>
}
export default Container
