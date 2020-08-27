import React,{useState,memo,useEffect,} from 'react'
import { Row , Col ,} from 'antd'
import './style.scss'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";
import {withRouter} from 'next/router'



function SideBar(props) {
	const [recommendList,setRecommendList] = useState([])
	const [rankList,setRankList] = useState([])
	useEffect(()=>{
		getRecommendList()
		getHotList()
	},[])

	async function getRecommendList(){
		try {
			let res = await get(ipPort+'/default/recommendList',{})
			if(res.length){
				setRecommendList(res)
			}
		}catch (e) {
			message.error('获取数据失败')
		}

	}

	async function getHotList(){
		try {
			let res = await get(ipPort+'/default/hotList',{})
			if(res.length){
				setRankList(res)
			}
		}catch (e) {
			message.error('获取数据失败')
		}

	}
	let itemClick = (id)=>{
		props.router.push(`/details?id=${id}`)
	}

	return <div className={'SideBar'}>

		<div className={'recommend card'}>
			<div className={'title'}><span>&nbsp;推荐阅读</span></div>
			<ul>
				{recommendList.map((item,index)=>{
					return <li key={index}>
						<a onClick={itemClick.bind(SideBar,item.id)}><span style={{color:'#7db8ee'}}>{index+1}.</span>&nbsp;{item.title}</a>
					</li>
				})}
			</ul>
		</div>

		<div className={'rank card'}>
			<div className={'title'}><span>&nbsp;访问排行</span></div>
			<ul>
				{rankList.map((item,index)=>{
					return <li key={index}>
						<a onClick={itemClick.bind(SideBar,item.id)}><span style={{color:'#7db8ee'}}>{index+1}.</span>&nbsp;{item.title}</a>
					</li>
				})}
			</ul>
		</div>

	</div>
}
export default memo(withRouter(SideBar))
