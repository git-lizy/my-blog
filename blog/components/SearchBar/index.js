import React, {memo} from 'react'
import {Col, Row,Input} from 'antd'
import {withRouter} from 'next/router'
import './style.scss'

function SearchBar(props) {
    const {onSearchReload} = props

    const onSearch = (value) =>{
        props.router.replace(`/list?keywords=${value}`)
        onSearchReload()
    }
    return <div className={'SearchBar'} id={'SearchBar'}>
            <Input.Search
                placeholder="搜索文章"
                onSearch={onSearch}
                // style={{ width: 200 }}
            />
    </div>
}

export default memo(withRouter(SearchBar))
