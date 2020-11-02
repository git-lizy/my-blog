/*
* 组件名称：底部内容
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo} from 'react'
import {Col, Row,} from 'antd'
import './style.scss'

function Footer(props) {
    return <div className={'Footer'}>
        <Row justify={'space-around'}>
            <Col span={24} style={{textAlign: 'center', color: '#bbbbbb'}}>
                <span className={'name'}>铸心&nbsp;个人技术博客</span>
                <div>
                    Powered By Next，Node & Antd
                </div>
                <a className="ICP" href={'http://beian.miit.gov.cn/'} target={'blank'}>
                    京ICP备2020040527号
                </a>
            </Col>
        </Row>
    </div>
}

export default memo(Footer)
