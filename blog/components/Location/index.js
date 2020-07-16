import React,{useState,memo} from 'react'
import { Breadcrumb} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function Location(props) {
	return <div className={'Location'}>
		<Breadcrumb separator=">">
			{props.locations.map(item=>{
				return <Breadcrumb.Item href={item.path}>{item.label}</Breadcrumb.Item>
			})}
		</Breadcrumb>

	</div>
}
Location.defaultProps={
	locations:[]
}
export default memo(withRouter(Location))
