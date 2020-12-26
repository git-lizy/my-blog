import React from 'react'
import './error.scss'
import {withRouter} from 'next/router'


function Error(props) {
    let backToIndex = () => {
        props.router.push('/')
    };
    return (

        <div className={'errorContainer'}>
            <div>
                <div className={'errorIcon iconfont icon-error'}></div>
                <div>页面走丢了</div>
                <a onClick={backToIndex.bind(Error)}>返回首页</a>
            </div>

        </div>

    )
}

export default withRouter(Error)
