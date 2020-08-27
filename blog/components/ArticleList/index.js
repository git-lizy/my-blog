import React,{useState,memo,useEffect,useRef} from 'react'
import { Row , Col ,message} from 'antd'
import {withRouter} from 'next/router'
import Qs from 'qs'
import { get } from '../../utils/requestUtil'
import "./style.scss"
import { debounce } from 'lodash'
import ipPort from '../../common/ipPort'

 function articleList(props) {
     // console.log('props',props)
    const [list,setList]=useState([])
     const [loadingText,setLoadingText]=useState('加载完毕')
     const {path}=props
     const newList =  useRef([])
     const CurrentPage = useRef(1)
     const isEnd=useRef(false) //是否加载全部完毕


     //翻页处理
     let scrollListener = ()=>{
        if(!isEnd.current){
            let query=path.lastIndexOf('?')>-1?Qs.parse(path.slice(path.lastIndexOf('?')+1)):{}
            let type = query.type
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            const totalHeight = document.documentElement.scrollHeight
            const clientHeight = document.documentElement.offsetHeight
            if(scrollTop+clientHeight>=totalHeight){
                getArticlList(type,CurrentPage.current+1)
                CurrentPage.current=CurrentPage.current+1
            }
        }

     }
    useEffect(()=>{
        // console.log('path',props.router)
        async function func(){
            let query=path.lastIndexOf('?')>-1?Qs.parse(path.slice(path.lastIndexOf('?')+1)):{}
            let type = query.type
            await getArticlList(type)

            scrollListener=debounce(scrollListener,1000)
            document.addEventListener('scroll',scrollListener)
        }
        func()
        return function () {
            document.removeEventListener('scroll',scrollListener)
        }


    },[])

    async function getArticlList(type,page){

        try {
            if(page){
                setLoadingText('正在加载')
                let res = await get(ipPort+'/default/articleList',{type,page})
                // console.log('res1',res)
                if(res.length){
                    setList([...newList.current , ...res])
                    newList.current=[...newList.current , ...res]
                }else{
                    isEnd.current=true //说明加载完毕

                }
                setLoadingText('加载完毕')

            }else{
                setLoadingText('正在加载')
                let res = await get(ipPort+'/default/articleList',{type})
                // console.log('res',res)
                setList(res)
                newList.current=res
                setLoadingText('加载完毕')
            }

        }catch (e) {
            message.error('获取数据失败')
            CurrentPage.current=CurrentPage.current-1
            setLoadingText('加载失败')
        }

    }
    let itemClick=(id)=>{

        props.router.push(`/details?id=${id}`)
    }
    return (
        <div className="articleList">
            {list.map(item=>{
                return <Row className={'articleItem card'} key={item.id} >
                        <Col className={'cover'}><img src="/icon/cover.jpg"  alt=""/></Col>
                    <Col className="msg">
                        <a className={'title'} onClick={itemClick.bind('',item.id)}>{item.title}</a>
                        <span className={'hotNumber'}>浏览次数：{item.hot}</span>
                        <span className={'introduce'}>{item.introduce}</span>
                    </Col>
                    </Row>
            })}

            <div className={'loadingText'}>{loadingText}</div>
        </div>
    )
}
export default withRouter(articleList)
