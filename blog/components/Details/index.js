import React,{useState,memo,useEffect} from 'react'
import { Row , Col ,message } from 'antd'
import Qs from 'qs'
import ReactMarkdown from 'react-markdown'
import { get } from '../../utils/requestUtil'
import highLight from 'highlight.js'
import marked from 'marked'
import "./style.scss"
import 'highlight.js/styles/monokai-sublime.css'
import {withRouter} from 'next/router'

function Detail(props) {
    const [text,setText]=useState('')
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

    useEffect(()=>{
        console.log('Detailpath',props.router)
        const path = props.router.asPath
        let query=path.lastIndexOf('?')>-1?Qs.parse(path.slice(path.lastIndexOf('?')+1)):{}
        let id = query.id
        console.log('id',id)
        getArticleDetail(id)
    },[])

    async function getArticleDetail(id){
        try {
            let res = await get('http://127.0.0.1:7001/frontEnd/articleDetail',{id})
            console.log('res',res)

            if(res.length){
                setText(res[0].content)
            }
        }catch (e) {
            message.error('获取数据失败')
        }

    }

    let HTML = marked(text)

    return(
        <div className="Detail card"  dangerouslySetInnerHTML = {{ __html: HTML }} >

        </div>
    )
}
export default withRouter(Detail)
