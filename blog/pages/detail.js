import React ,{useEffect}from 'react'
import Detail from '../components/Detail'
import {withRouter} from 'next/router'
import {useCookie} from 'next-cookie'
import Head from 'next/head'
import Qs from 'qs'
import {connect} from 'react-redux'
import {get} from "../utils/requestUtil";
import ipPort from "../common/ipPort";
import {SET_DETAIL} from "../store/action";

const initMapDispatchToProps = (dispath) => {
    return {
        setDetail(data) {
            dispath(SET_DETAIL(data))
        },
    }
};
const initMapStateToProps = (state) => {
    return {}

};
function Home(props) {
    const {detailData,setDetail} = props
    useEffect(()=>{
        setDetail(detailData)
    })
    return (
        <>
            <Head>
                <title>铸心个人博客|{detailData.title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="keywords" content="铸心,博客,前端,web前端,html,css,javascript,vue,react,es6,node,webpack"/>
                <meta name="description" content="铸心个人技术博客于学习笔记，专注于互联网web前端基础技术分享,包括html,css,javascript,vue,react,es6,node,webpack等相关技术"/>
            </Head>
        <Detail data={detailData} key={props.router.asPath}/>
        </>
    )
}

//服务端渲染获取初始数据
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
    const jingHaoIndex = path.lastIndexOf('#') > -1 ? path.lastIndexOf('#'):false
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1,jingHaoIndex?jingHaoIndex:path.length)) : {};
    // console.log('queryeeee',query)
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

export default connect(initMapStateToProps, initMapDispatchToProps)(withRouter(Home))
