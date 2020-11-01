/*
* 组件名称：侧边栏
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect, useState,} from 'react'
import {message, Spin} from 'antd'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";
import NavBar from '../../components/NavBar'
import About from '../../components/About'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'
import {withRouter} from 'next/router'
import './style.scss'


function SideBar(props) {
    const {typeList, articleDetail} = props
    // console.log('articleDetail',articleDetail)
    const [isDetail] = useState(!!props.router.asPath.startsWith('/detail?'))
    const [rankList, setRankList] = useState([]);
    const [rankLoading, setRankLoading] = useState(false);
    useEffect(() => {
        getHotList()
    }, []);


    async function getHotList() {
        setRankLoading(true);
        try {
            let res = await get(ipPort + '/default/hotList', {});
            setRankLoading(false);
            if (res.success) {
                setRankList(res.results)
            } else {
                setRankList([]);
                message.error(`获取热门信息失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setRankLoading(false);
            message.error(`获取热门信息失败，异常信息为：${e}`)
        }


    }

    let itemClick = (id) => {
        props.router.push(`/detail?id=${id}`)
    };

    return <div className={'SideBar'}>

        <div className={'about card'}>
            <div className={'title'}><span>&nbsp;关于博主</span></div>
            <About/>
        </div>


        {!isDetail &&
        <>
            <div className={'classify card'}>
                <div className={'title'}><span>&nbsp;文章分类</span></div>
                <NavBar path={props.router.asPath} typeList={typeList}/>
            </div>


            <Spin spinning={rankLoading}>
                <div className={'rank card'}>
                    <div className={'title'}><span>&nbsp;热门文章</span></div>
                    <ul>
                        {rankList.map((item, index) => {
                            return <li key={index}>
                                <a onClick={itemClick.bind(SideBar, item.id)}><span
                                    style={{color: '#7db8ee'}}>{index + 1}.</span>&nbsp;{item.title}</a>
                            </li>
                        })}
                    </ul>
                </div>
            </Spin>
        </>
        }

        {isDetail &&
        <div className={'markNav card'}>
            <div className={'title'}><span>&nbsp;文章导航</span></div>
            <MarkNav
                className="markNavMain"
                source={articleDetail.content ? articleDetail.content : ''}
                // headingTopOffset={80}
                ordered={false}
            />
        </div>
        }


    </div>
}

export default memo(withRouter(SideBar))
