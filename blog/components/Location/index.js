import React,{useState,memo,useEffect} from 'react'
import { Breadcrumb,Col} from 'antd'
import Qs from 'qs'
import {withRouter} from 'next/router'
import './style.scss'

function Location(props) {
	// console.log('router',props)
	const [locations,setLocations] = useState([])
	const {router:{asPath}} = props

	useEffect(()=>{
		let list  = asPath==='/'?['']:asPath.split('/')

		let newList = []
		let query=asPath.lastIndexOf('?')>-1?Qs.parse(asPath.slice(asPath.lastIndexOf('?')+1)):{}
		list.forEach((item,index)=>{
			if(item===''){
				newList.push({name:'首页',path:'/'})
				if(query.type){
					console.log('xxx')
					newList.push({name:query.type,path:`?type=${query.type}`})
				}

			}
			if(item==='details'){
				newList.push({name:'文章详情',path:'/details'})
				// if(query.type){
				// 	newList.push({name:query.type,path:`?type=${query.type}`})
				// }
			}

		})
		setLocations(newList)


	},[])

	return <Col className={'Location'} xs={0} sm={0} md={24}>
		当前位置：
		<Breadcrumb separator=">" style={{display:'inline-block'}}>
			{locations.map((item,index)=>{
				return <Breadcrumb.Item key={index} href={item.path}>{item.name}</Breadcrumb.Item>
			})}
		</Breadcrumb>

	</Col>
}
Location.defaultProps={
	locations:[]
}
export default withRouter(memo(Location))
