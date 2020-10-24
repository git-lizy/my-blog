import React, {memo} from 'react'
import {message, Tooltip} from 'antd'
import {WechatOutlined, QqOutlined, GithubOutlined} from '@ant-design/icons'
import './style.scss'

function About(props) {
    return <div className={'About'}>
        <div className={'aboutMain'}>
            <section className={'headPhoto'}></section>
            <section className={'logo'}></section>
            <section className={'split'}>
                <span></span>
                <span>社交账号</span>
                <span>
                    </span>
            </section>
            <section className={'socialContact'}>
                <Tooltip trigger={['click']} title="WeChat：scw19970622" key={'wechat'}>
                    <WechatOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
                <Tooltip trigger={['click']} title="QQ/Tim：1091479495" key={'qq'}>
                    <QqOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
                <Tooltip trigger={['click']} title="GitHub：https://github.com/scw1997" key={'github'}>
                    <GithubOutlined style={{fontSize: '20px'}}/>
                </Tooltip>
            </section>
        </div>
    </div>
}

export default memo(About)
