import React, {useEffect, useState} from 'react'
import {message, Spin} from 'antd'
import {useCookie} from 'next-cookie'
import Qs from 'qs'
import {get,post} from '../../utils/requestUtil'
import highLight from 'highlight.js'
import marked from 'marked'
import ipPort from '../../common/ipPort'
import "./style.scss"
import './detail.scss'
import 'highlight.js/styles/monokai-sublime.css'
import {withRouter} from 'next/router'

function Detail(props) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const renderer = new marked.Renderer();
    const Cookie = useCookie()

    marked.setOptions({
        renderer: renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return highLight.highlightAuto(code).value;
        }
    });
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

    useEffect(() => {
        const path = props.router.asPath;
        let query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
        let id = query.id;
        console.log('id', id);
        getArticleDetail(id,shouldUpdateHot(id))
    }, []);

    async function getArticleDetail(id,shouldUpdate) {
        setLoading(true);
        try {
            let res = await get(ipPort + '/default/articleDetail', {id,update:shouldUpdate});
            setLoading(false);
            if (res.success && res.results.length) {
                setData(res.results[0])
            } else {
                setData({});
                message.error(`获取文章详情失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setLoading(false);
            setData({});
            message.error(`获取文章详情失败，异常信息为：${e}`)
        }

    }


    let HTML = data.content ? marked(data.content) : '';

    return (
        <Spin spinning={loading}>
            <div className="detail">
                <div className="detailMain card">
                    <div className={'otherMsg'}>
                        <div className={'title'}>{data.title}</div>
                        <div className={'date'}>
                            <span>发布时间：{data.create_date}</span>
                            <span>更新时间：{data.update_date}</span>
                        </div>
                    </div>

                    <div id={'detail'} className={'markedContent'} dangerouslySetInnerHTML={{__html: HTML}}></div>
                </div>
            </div>
        </Spin>
    )
}

export default withRouter(Detail)
