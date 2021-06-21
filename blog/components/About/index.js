/*
* 组件名称：关于博主
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo} from 'react'
import {Tooltip} from 'antd'
import {GithubOutlined, QqOutlined, WechatOutlined} from '@ant-design/icons'
import './style.scss'

function About(props) {
    const {Info} = props
    return <div className={'About'}>
        <div className={'aboutMain'}>
            <section className={'headPhoto'}></section>
            <section className={'logo'}>{Info.username}</section>
            <section className={'split'}>
                <span></span>
                <span>社交账号</span>
                <span>
                    </span>
            </section>
            <section className={'socialContact'}>
                <Tooltip trigger={['click']} title={'WeChat：'+Info.wechat} key={'wechat'}>
                    <WechatOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
                <Tooltip trigger={['click']} title={"QQ/Tim："+Info.QQ} key={'qq'}>
                    <QqOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
                <Tooltip trigger={['click']} title={"GitHub："+Info.github} key={'github'}>
                    <GithubOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
            </section>
        </div>
    </div>
}

export default memo(About)
