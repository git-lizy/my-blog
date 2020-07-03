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
			<Col span={20}></Col>
			<Col span={4}>
				<SideBar/>
			</Col>
		</Row>
	</>
}
export default Container
