import React, {memo,useEffect} from 'react'
import {Col, Row,Statistic} from 'antd'
import Qs from 'qs'
import {withRouter} from 'next/router'
import './style.scss'

function NavBar(props) {
    const {typeList,path,onRef} = props;
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    const {type} = query;

    const typeClick = async (item,e) => {
        e.nativeEvent.stopImmediatePropagation()
        props.router.push(`/list?type=${item.name}`)

    };
    // useEffect(()=>{
    //     const dom = document.getElementById('NavBar')
    //     onRef && onRef(dom)
    // },[])

    return <div className={'NavBar'} id={'NavBar'}>
        <Row >
            {typeList.map((item, index) => {
                return <Col onClick={(e) => {typeClick(item,e)}} key={index} sm={4} xs={4} md={24} className={`NavBarItem ${type===item.name?'active':''}`}>
                    {item.name}
                    <span className={'itemTotal'} style={{}}>（1篇）</span>
                </Col>
            })}

            <Statistic title="文章总数" value={11343555} suffix="篇"   />
            &nbsp;&nbsp;
            <Statistic title="总访问量" value={112893} suffix="次"  />
        </Row>
    </div>
}

export default (memo(withRouter(NavBar)))
