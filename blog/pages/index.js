import React, {useEffect, useRef, useState} from 'react'
import {Col, message, Row, Spin,Skeleton} from 'antd'
import {withRouter} from 'next/router'
import ArticleList from '../components/ArticleList'
import Qs from 'qs'
import {get} from './../utils/requestUtil'
import {throttle} from 'lodash'
import ipPort from './../common/ipPort'


function Home(props) {

    const {initialList} = props;
    return (

        <ArticleList
            path={props.router.asPath}
            initialList={initialList}
        />
    )
}

Home.getInitialProps = async()=>{
    try{
        let res = await get(ipPort + '/default/articleList', {page:1});
        if (res.success) {

            return {initialList:res.results}
        } else {
            return {initialList:[]}
        }
    }catch (e) {
        return {initialList:[]}
    }



}

export default withRouter(Home)
