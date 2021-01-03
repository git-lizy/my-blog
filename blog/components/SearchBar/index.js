/*
* 组件名称：文章搜索
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo} from 'react'
import {Input} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function SearchBar(props) {
    const {onSearchReload} = props

    const onSearch = (value) => {
        props.router.replace(`/list?keywords=${value}`)
        onSearchReload()
    }
    return <div className={'SearchBar'} id={'SearchBar'} onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation()
    }}>
        <Input.Search
            placeholder="搜索文章"
            onSearch={onSearch}
        />
    </div>
}

export default memo(withRouter(SearchBar))
