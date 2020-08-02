import React,{useState,memo} from 'react'
import Header from '../Header'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import Location from '../Location'
import { Row , Col ,Breadcrumb} from 'antd'
import './style.scss'

function Container(props) {
	return <>
		<Header/>
		<NavBar pathChange={props.pathChange}/>
		<Row  className={'containerMainRow'}>
			<Col xs={24} sm={24} md={19}>
				<Location />
				{props.children}
			</Col>
			<Col xs={0} sm={0} md={5}>
				<SideBar/>
			</Col>
		</Row>
	</>
}
export default Container
