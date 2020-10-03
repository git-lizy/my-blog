import React, {memo,useState} from 'react'
import {Col, Row,} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {withRouter} from 'next/router'
import './style.scss'

function Header(props) {
    const [show,setShow] = useState(false)
    const indexClick = () => {
        props.router.push(`/`)
    };

    const onSearchClick = () =>{
        const searchBarStyle = document.getElementById('SearchBar').style
        if(show){
            searchBarStyle.zIndex='-1';
            setShow(false)
        }else{
            searchBarStyle.zIndex='100';
            setShow(true)
        }

    }
    return <div className={'Header'}>
        <Row justify={'space-around'}>
            <Col xs={20} sm={20} md={12} >
                <a className={'name'} onClick={indexClick.bind(Header)}>小蚊子</a>
                <span className={'type'}>&nbsp;个人技术博客</span>
            </Col>
            <Col xs={0} sm={0} md={10} className={'description'}>专注于互联网前端基础技术分享</Col>
            <Col xs={2} sm={2} md={0} className={'searchIcon'} >
                <div onClick={onSearchClick}>
                    <SearchOutlined style={{color:'#7db8ee',fontSize:'18px'}} />
                </div>

            </Col>
        </Row>
    </div>
}

export default memo(withRouter(Header))
