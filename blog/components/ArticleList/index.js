import React,{useState,memo,useEffect} from 'react'
import { Row , Col ,message} from 'antd'
import {withRouter} from 'next/router'
import Qs from 'qs'
import { get } from '../../utils/requestUtil'
import "./style.scss"

 function articleList(props) {
     console.log('router',props)
    const [list,setList]=useState([])
     const {path} = props
    useEffect(()=>{
        console.log('path',path)
        let query=path.lastIndexOf('?')>-1?Qs.parse(path.slice(path.lastIndexOf('?')+1)):{}
        let type = query.type
        getArticlList(type)
    },[])

    async function getArticlList(type){
        try {
            let res = await get('http://127.0.0.1:7001/frontEnd/articleList',{type})
            console.log('res',res)
            setList(res)
        }catch (e) {
            message.error('获取数据失败')
        }

    }
    return (
        <div className="articleList">
            {list.map(item=>{
                return <Row className={'articleItem card'} key={item.id} >
                        <Col className={'cover'}><img src="/icon/cover.jpg"  alt=""/></Col>
                    <Col className="msg">
                        <span className={'title'}>{item.title}</span>
                        <span className={'hotNumber'}>浏览次数：{item.hot}</span>
                        <span className={'detail'}>{item.introduce}</span>
                    </Col>
                    </Row>
            })}
        </div>
    )
}
export default articleList
