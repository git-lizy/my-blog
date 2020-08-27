import React,{useState,memo} from 'react'
import { Row , Col ,} from 'antd'
import './style.scss'

function Footer(props) {
	return <div className={'Footer'}>
		<Row justify={'space-around'} >
			<Col span={24} style={{textAlign:'center',color:'#bbbbbb'}}>
				<span className={'name'}>小蚊子&nbsp;个人技术博客</span>
				<div>
					Powered By Next，Node & Antd
				</div>
			</Col>
		</Row>
	</div>
}
export default memo(Footer)
