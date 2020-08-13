import React,{useState,memo,useEffect} from 'react'
import { Row , Col ,message} from 'antd'
import { withRouter } from 'next/router'
import './style.scss'
import {get} from "../../utils/requestUtil";

function NavBar(props) {
	const [list,setList] = useState([])
	useEffect(()=>{
		getArticlType()
	},[])

	async function getArticlType(){
		try {
			let res = await get('http://127.0.0.1:7001/frontEnd/articleType',{})
			setList(res)
		}catch (e) {
			message.error('获取数据失败')
		}

	}
	const typeClick=async(item)=>{
		props.router.push(`/?type=${item.name}`)

	}
	return <div className={'NavBar'}>
		<Row justify={'space-around'} >
			{list.map((item,index)=>{
				return <Col onClick={()=>{typeClick(item)}} key={index} xs={6} sm={4}  className={'NavBarItem'}>{item.name}</Col>
			})}
		</Row>
	</div>
}
export default memo(withRouter(NavBar))
