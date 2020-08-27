import React,{useState,memo,useEffect,useRef} from 'react'
import Header from '../Header'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import Location from '../Location'
import Footer from '../Footer'
import {withRouter} from 'next/router'
import { Row , Col ,Breadcrumb} from 'antd'
import './style.scss'


function Container(props) {


	return <>
		<Header />
		<NavBar />
		<Row  className={'containerMainRow'}>
			<Col  xs={24} sm={24} md={19}>
				<Location key={props.router.asPath} path={props.router.asPath} />
				<div className={'children'}>
					{props.children}
				</div>


			</Col>
			<Col xs={0} sm={0} md={5}>
				<SideBar />
			</Col>
		</Row>
		<Footer/>
	</>
}
export default withRouter(memo(Container))
