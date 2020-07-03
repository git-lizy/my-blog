import React,{useState} from 'react'
import { Row , Col ,} from 'antd'
import './style.scss'

function NavBar(props) {
	const NavBarList = ['HTML','CSS','JavaScript','ES6+','React','Vue']
	return <div className={'NavBar'}>
		<Row justify={'space-around'} >
			{NavBarList.map((item,index)=>{
				return <Col key={index} xs={6} sm={4}  className={'NavBarItem'}>{item}</Col>
			})}
		</Row>
	</div>
}
export default NavBar
