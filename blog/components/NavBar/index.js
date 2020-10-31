/*
* 组件名称：分类导航
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect, useState} from 'react'
import {Col, message, Row, Statistic} from 'antd'
import Qs from 'qs'
import {withRouter} from 'next/router'
import './style.scss'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";

function NavBar(props) {
    const {typeList, path, onRef} = props;
    const jingHaoIndex = path.lastIndexOf('#') > -1 ? path.lastIndexOf('#') : false
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1, jingHaoIndex ? jingHaoIndex : path.length)) : {};
    const {type} = query;
    const [articleTotal, setArticleTotal] = useState(0)
    const [hotTotal, setHotTotal] = useState(0)

    const typeClick = async (item, e) => {
        e.nativeEvent.stopImmediatePropagation()
        props.router.push(`/list?type=${item.name}`)

    };
    const getTotals = async () => {
        try {
            let res = await get(ipPort + '/default/getArticleTotals', {});
            if (res.success && res.totals) {
                setHotTotal(res.totals.hot)
                setArticleTotal(res.totals.article)
            } else {
                message.error('获取博客统计数据失败')
            }
        } catch (e) {
            message.error('获取博客统计数据失败')
        }
    }
    useEffect(() => {
        getTotals()
    }, [])

    return <div className={'NavBar'} id={'NavBar'}>
        <Row>
            {typeList.map((item, index) => {
                return <Col onClick={(e) => {
                    typeClick(item, e)
                }} key={index} sm={6} xs={6} md={24} className={`NavBarItem ${type === item.name ? 'active' : ''}`}>
                    {item.name}
                    <span className={'itemTotal'} style={{}}>（{item.total}篇）</span>
                </Col>
            })}

            <Statistic title="文章总数" value={articleTotal} suffix="篇"/>
            {/*&nbsp;&nbsp;*/}
            <Statistic title="总访问量" value={hotTotal} suffix="次"/>
        </Row>
    </div>
}

export default (memo(withRouter(NavBar)))
