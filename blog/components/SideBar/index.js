import React,{useState,memo} from 'react'
import { Row , Col ,} from 'antd'
import './style.scss'

function SideBar(props) {
	const recommendList=[1,2,3,4,5,6,7,8,9,10].map(item=>'我们为什么学前端')
	const rankList=[1,2,3,4,5,6,7,8,9,10].map(item=>'我们为什么学前端')
	return <div className={'SideBar'}>
		<div className={'recommend card'}>
			<div className={'title'}><span>&nbsp;推荐阅读</span></div>
			<ul>
				{recommendList.map((item,index)=>{
					return <li key={index}>{item}</li>
				})}
			</ul>
		</div>

		<div className={'rank card'}>
			<div className={'title'}><span>&nbsp;访问排行</span></div>
			<ul>
				{recommendList.map((item,index)=>{
					return <li key={index}>{item}</li>
				})}
			</ul>
		</div>

	</div>
}
export default memo(SideBar)
