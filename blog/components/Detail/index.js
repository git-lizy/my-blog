/*
* 组件名称：文章详情
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React,{memo, useState} from 'react'
import highLight from 'highlight.js'
import marked from 'marked'
import "./style.scss"
import './detail.scss'
import 'highlight.js/styles/monokai-sublime.css'
import { addFavour } from "../../pages/api"
import { message } from 'antd'

function Detail(props) {
    const {data, id} = props
   
    const [favour, setFavour] = useState(Number(data.favour))
    let num = Number(data.favour)
    
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

    const addFavourHandle = async () => {
        let res = await addFavour({ id, favour: num + 1 })
        if (res.success) {
            num++
            setFavour(num)
            message.success(res.msg)
        } else  {
            message.error(res.msg)          
        }
    }

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
                    <div class="good">
                        <button type="button" onClick={addFavourHandle} class="ant-btn ant-btn-primary ant-btn-lg">
                            <span>点个赞({favour || 0})</span>
                        </button>
                    </div>
                </div>
                {/* <div class="comment">
                    <div style={{width:"100%;"}}>
                        <div class="comment">
                            <div class="write">
                                <textarea placeholder="留言支持MarkDown语法，点击下面 “图书” 图标进行预览..."></textarea>
                            </div>
                            <div class="operation">
                                <div class="left">
                                    <i aria-label="icon: read" tabindex="-1" class="anticon anticon-read" >
                                        <svg viewBox="64 64 896 896" data-icon="read" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z"></path>
                                        </svg>
                                    </i>
                                </div>
                                <div class="right">
                                    <div class="name">
                                        <i aria-label="icon: user" class="anticon anticon-user">
                                            <svg viewBox="64 64 896 896" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                                            </svg>
                                        </i>
                                        <input placeholder="你的昵称" value="" />
                                    </div>
                                    <div class="submit">
                                        发&nbsp;&nbsp;&nbsp;布
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                         <div class="history">
                            <div class="father">
                                <div class="top">
                                    <div class="headPortrait">
                                        <img src="https://s2.ax1x.com/2020/01/30/1l8ygH.png" alt=""/>
                                    </div> 
                                    <div class="userName">
                                        <b data-v-57fcb19a="">lzy</b>
                                    </div> 
                                    <div class="time">
                                        <span data-v-57fcb19a="">2021-06-19 16:29:36</span>
                                    </div>
                                    <div class="reply">
                                        <span data-v-57fcb19a="">回复</span>
                                    </div> 
                                    <div class="ranking">
                                        <span data-v-57fcb19a="">第3楼</span>
                                    </div>
                                </div>
                                <div  class="button"><p>哈哈</p></div>
                            </div> 
                        </div>
                    </div>
                </div>   */}
            </div>

    )
}

export default memo(Detail)
