import React from 'react'
import Detail from '../components/Detail'
import {withRouter} from 'next/router'
import {useCookie} from 'next-cookie'
import Qs from 'qs'
import {get} from "../utils/requestUtil";
import ipPort from "../common/ipPort";


function Home(props) {
    const {detailData} = props
    return (
        <Detail data={detailData} key={props.router.asPath}/>
    )
}

Home.getInitialProps = async(ctx)=>{
    const Cookie = useCookie()
    //判断是否需要更新浏览量（通过设置cookie以及有效期）
    const shouldUpdateHot=(id)=>{
        //没有该文章的相应cookie，则执行更新
        if(!Cookie.get(`updateHot_${id}`)){
            Cookie.set(`updateHot_${id}`,id,{maxAge:3600*3}) //设置三小时有效期
            return true
        }else{
            return false
        }
    }

    const {asPath:path}=ctx
    let query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    let id = query.id;
    let update = shouldUpdateHot(id)
    try{
        let res = await get(ipPort + '/default/articleDetail', {id,update});
        if (res.success) {

            return {detailData:res.results[0]}
        } else {
            return {detailData:{}}
        }
    }catch (e) {
        return {detailData:{}}
    }



}

export default withRouter(Home)
