import React,{useState,memo,useEffect} from 'react'
import { Row , Col ,message} from 'antd'
import { get } from '../../utils/requestUtil'
import "./style.scss"

export default function articleList() {
    const [list,setList]=useState([])

    useEffect(()=>{
        getArticlList()
    },[])

    async function getArticlList(){
        try {
            let res = await get('http://127.0.0.1:7001/frontEnd/articleList',{})
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
