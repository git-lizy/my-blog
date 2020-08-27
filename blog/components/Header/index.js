import React,{useState,memo} from 'react'
import { Row , Col ,} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function Header(props) {
	let indexClick=()=>{

		props.router.push(`/`)
	}
	return <div className={'Header'}>
		<Row justify={'space-around'} >
			<Col xs={22} sm={10} >
				<a className={'name'} onClick={indexClick.bind(Header)}>小蚊子</a>
				<span className={'type'}>&nbsp;个人技术博客</span>
			</Col>
			<Col xs={0} sm={10}  className={'description'}>专注于互联网前端基础技术分享</Col>
		</Row>
	</div>
}
export default memo(withRouter(Header))
