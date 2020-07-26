import React,{useState,memo,useEffect} from 'react'
import { Breadcrumb,Col} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function Location(props) {
	// console.log('router',props)
	const [locations,setLocations] = useState([])
	const {router:{pathname,query}} = props

	useEffect(()=>{
		let list  = pathname==='/'?['']:pathname.split('/')

		let newList = []
		let currentPath='/'
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
		console.log('newList',newList)
		if(JSON.stringify(newList) !== JSON.stringify(locations)){
			console.log('yyy',newList,locations)
			setLocations(newList)
		}

	},[locations])

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
