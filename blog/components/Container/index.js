/*
* 组件名称：页面公共父组件
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect, useState} from 'react'
import Header from '../Header'
import SideBar from '../SideBar'
import Location from '../Location'
import SearchBar from '../SearchBar'
import Footer from '../Footer'
import {withRouter} from 'next/router'
import {BackTop, Col, Row} from 'antd'
import {connect} from 'react-redux'
import {GET_TYPE, GET_INFO } from '../../store/action'
import './style.scss'


//redux获取文章列表数据
const initMapDispatchToProps = (dispath) => {
    return {
        getTypeList(data) {
            dispath(GET_TYPE(data))
        },
        getUserInfo(data) {
            dispath(GET_INFO(data))
        }
    }
};
const initMapStateToProps = (state) => {
    return {
        typeList: state.articleTypeList,
        articleDetail: state.articleDetail,
        info: state.userInfo
    }
};

function Container(props) {
    const {typeList, info, articleDetail, router } = props;
    const {asPath: path} = router
    //获取get参数
    const query = router.query
    
    useEffect(() => {
        let account = query.account
        if (account) props.getUserInfo({ account })
    }, [])
    
    //获取个人信息
    // const getUserInfo = async (account='admin') => {
    //     try {
    //         let res = await get(ipPort + '/admin/info', { account });
    //         if (res.success) {
    //             setUserInfo(res.info)
    //         } else {
    //             setUserInfo({})
    //             message.error(`获取个人信息失败，异常信息为：${res.code}`)
    //         }
    //     } catch (e) {
    //         setUserInfo({})
    //         message.error(`获取个人信息失败，异常信息为：${e}`)
    //     }
    // }
    //处理点击搜索时重置刷新文章列表（因为当搜索关键字前后一样时，文章列表不会刷新）
    const [searchReload, setSearchReload] = useState(false)
    useEffect(() => {
        props.getTypeList()
    }, []);

    const onSearchReload = () => {
        setSearchReload(!searchReload)
    }

    return <>
        <Header typeList={typeList} Info={info} onSearchReload={onSearchReload}/>
        <Row className={'containerMainRow'}>
            <Row style={{width: '100%'}} align="middle">
                <Col xs={0} sm={0} md={18} style={{paddingBottom: '10px'}}>
                    {typeList.length > 0 &&
                    <Location typeList={typeList} Info={info} key={path} path={path}/>}
                </Col>
                <Col xs={0} md={6} style={{paddingBottom: '10px'}}>
                    <SearchBar onSearchReload={onSearchReload}/>
                </Col>
            </Row>

            <Row style={{width: '100%'}}>
                <Col xs={24} sm={24} md={18}>

                    <div className={'children'} key={searchReload}>
                        {props.children}
                    </div>

                </Col>
                <Col xs={0} sm={0} md={6}>
                    <SideBar key={path} Info={info} typeList={typeList} articleDetail={articleDetail}/>
                </Col>
            </Row>
        </Row>
        <Footer/>
        <div className={'backToTopContainer'}>
            <BackTop visibilityHeight={1200}>
                <div className={'backToTop iconfont icon-backToTop'}></div>
            </BackTop>
        </div>
    </>
}

export default connect(initMapStateToProps, initMapDispatchToProps)(withRouter(memo(Container)))
