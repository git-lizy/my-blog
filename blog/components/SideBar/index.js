/*
* 组件名称：侧边栏
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect, useState} from 'react'
import {message, Spin,Affix} from 'antd'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";
import NavBar from '../../components/NavBar'
import About from '../../components/About'
import MarkNav from 'markdown-navbar'
import 'markdown-navbar/dist/navbar.css'
import {withRouter} from 'next/router'
import './style.scss'

function SideBar(props) {
    const {typeList, articleDetail, Info } = props
    const [isDetail] = useState(!!props.router.asPath.startsWith('/detail?'))
    const [rankList, setRankList] = useState([]);
    const [rankLoading, setRankLoading] = useState(false);
    useEffect(() => {
        getHotList()

    }, []);


    async function getHotList() {
        setRankLoading(true);
        let { userId } = Info
        try {
            let res = await get(ipPort + '/default/hotList', { userId });
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

        <div className={'about card classify'}>
            <div className={'title iconfont icon-about'}><span>&nbsp;关于博主</span></div>
            <About Info={Info} />
        </div>


        {!isDetail &&
        <>
            <div className={'classify card'}>
                <div className={'title iconfont icon-classify'}><span>&nbsp;文章分类</span></div>
                <NavBar path={props.router.asPath} typeList={typeList} Info={Info} />
            </div>


            <Spin spinning={rankLoading}>
                <div className={'rank card classify'}>
                    <div className={'title iconfont icon-rank'}><span>&nbsp;热门文章</span></div>
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

            <div className={'friend card classify'}>
                <div className={'title iconfont icon-rank'}><span>&nbsp;友情链接</span></div>
                <ul>
                    <li>
                        <a href={'http://www.tangyincheng.com/'} target={'blank'}>yctang</a>
                    </li>

                </ul>
            </div>
        </>

        }

        {isDetail &&
            <Affix offsetTop={60}>
                <div className={'markNav card '} id={'markNav'}>
                    <div className={'title iconfont icon-navBar'}><span>&nbsp;文章导航</span></div>
                    <MarkNav
                        className="markNavMain"
                        source={articleDetail.content ? articleDetail.content : ''}
                        updateHashAuto={false}
                        // headingTopOffset={80}
                        ordered={false}
                    />
                </div>
            </Affix>

        }


    </div>
}

export default (withRouter(SideBar))
