/*
* 组件名称：顶部内容
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect, useRef, useState} from 'react'
import {Col, Dropdown, Menu, Modal, Row} from 'antd'
import {MenuOutlined,} from '@ant-design/icons'
import {withRouter} from 'next/router'
import NavBar from '../NavBar'
import SearchBar from "../SearchBar";
import About from "../About";
import './style.scss'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";


function Header(props) {
    //分类显隐
    const [classifyVisible, setClassifyVisible] = useState(false)
    //搜索显隐
    const [searchVisible, setSearchVisible] = useState(false)
    //关于显隐
    const [aboutVisible, setAboutVisible] = useState(false)
    //背景大图
    const [bgPath, setBgPath] = useState('')
    const {typeList, onSearchReload} = props
    const header = useRef()
    const headerMain = useRef()
    const indexClick = () => {
        props.router.push(`/`)
    };

    async function getBgImage() {
        try {
            let res = await get(ipPort + '/default/getBgImage', {});
            if (res.success && res.path) {
                setBgPath(res.path)
            } else {
                setBgPath('/icon/default_bg.jpg')
            }
        } catch (e) {
            setBgPath('/icon/default_bg.jpg')
        }


    }

    const scrollListener = () => {
        const headerHeight = header.current.offsetHeight
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > headerHeight - 50) {
            headerMain.current.classList.add('scrollStyle')
        } else {
            headerMain.current.classList.remove('scrollStyle')

        }
    }

    const clickListener = () => {
        setClassifyVisible(false)
        setSearchVisible(false)
    }
    useEffect(() => {
        getBgImage()
        headerMain.current = document.querySelector('.HeaderMain')
        header.current = document.getElementById('Header')
        document.addEventListener('scroll', scrollListener)
        document.addEventListener('click', clickListener)
        return () => {
            document.removeEventListener('scroll', scrollListener)
            document.removeEventListener('click', clickListener)
        }
    }, [])

    const MenuItemClick = (type, e) => {
        e.nativeEvent.stopImmediatePropagation()
        switch (type) {
            case 'classify':
                setClassifyVisible(true)
                break
            case 'search':
                setSearchVisible(true)
                break
            case 'about':
                setAboutVisible(true)
                break
            default :
                break
        }
    }

    const classifyMenu = (
        <Menu>
            <Menu.Item>
                <a className={'search'} onClick={MenuItemClick.bind(Header, 'classify')}>文章分类</a>
            </Menu.Item>
            <Menu.Item>
                <a className={'search'} onClick={MenuItemClick.bind(Header, 'search')}>文章搜索</a>
            </Menu.Item>
            <Menu.Item>
                <a className={'search'} onClick={MenuItemClick.bind(Header, 'about')}>关于博主</a>
            </Menu.Item>
        </Menu>
    )


    return <div className={'Header'} id={'Header'} style={{backgroundImage: `url(${ipPort + bgPath})`}}>
    {/*//     return <div className={'Header'} id={'Header'} >*/}
        <Row justify={'space-around'} className={'HeaderMain'}>
            <Col xs={13}>
                <a className={'name'} onClick={indexClick.bind(Header)}>铸心</a>
                <span className={'type'}>&nbsp;个人技术博客</span>
            </Col>
            <Col xs={0} md={7} className="headerRight">
                你见树，却未见森林
            </Col>
            <Col xs={7} md={0} className="headerRight">
                <Dropdown overlay={classifyMenu} trigger={['click']}>
                    <MenuOutlined style={{fontSize: '18px'}}/>
                </Dropdown>
            </Col>

            {/*搜索框 文章分类*/}
            <Col xs={24} md={0}>
                {classifyVisible && <NavBar path={props.router.asPath} typeList={typeList}/>}
                {searchVisible && <SearchBar onSearchReload={onSearchReload}/>}
                <Modal
                    title="关于博主"
                    visible={aboutVisible}
                    footer={null}
                    destroyOnClose
                    wrapClassName={'aboutModal'}
                    onCancel={() => {
                        setAboutVisible(false)
                    }}
                >
                    <About/>
                </Modal>

            </Col>


        </Row>
    </div>
}

export default memo(withRouter(Header))
