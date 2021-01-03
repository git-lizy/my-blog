/*
* 组件名称：文章详情
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React,{memo} from 'react'
import highLight from 'highlight.js'
import marked from 'marked'
import "./style.scss"
import './detail.scss'
import 'highlight.js/styles/monokai-sublime.css'

function Detail(props) {
    const {data} = props
    const renderer = new marked.Renderer();

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

    let HTML = data.content ? marked(data.content) : '';

    return (
            <div className="detail">
                <div className="detailMain card">
                    <div className={'otherMsg'}>
                        <strong className={'title'}>{data.title}</strong>
                        <div className={'date'}>
                            <span>发布时间：{data.create_date?.slice(0, 10)}</span>
                            <span>更新时间：{data.update_date?.slice(0, 10)}</span>
                        </div>
                    </div>

                    <div id={'detail'} className={'markedContent'} dangerouslySetInnerHTML={{__html: HTML}}></div>
                </div>
            </div>

    )
}

export default memo(Detail)
