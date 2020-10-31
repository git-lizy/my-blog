/*
* 组件名称：文章搜索
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {memo, useEffect} from 'react'
import {Input} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function SearchBar(props) {
    const {onSearchReload, onRef} = props

    const onSearch = (value) => {
        props.router.replace(`/list?keywords=${value}`)
        onSearchReload()
    }
    useEffect(() => {
        // const dom = document.getElementById('SearchBar')
        // onRef && onRef(dom)


        // const headerHeight = document.getElementById('Header').offsetHeight
        // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        // if (scrollTop > headerHeight - 50) {
        //     dom.classList.add('scrollStyle')
        // } else {
        //     dom.classList.remove('scrollStyle')
        // }

    }, [])
    return <div className={'SearchBar'} id={'SearchBar'} onClick={(e) => {
        e.nativeEvent.stopImmediatePropagation()
    }}>
        <Input.Search
            placeholder="搜索文章"
            onSearch={onSearch}
            // style={{ width: 200 }}
        />
    </div>
}

export default memo(withRouter(SearchBar))
