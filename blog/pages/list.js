import React from 'react'
import ArticleList from '../components/ArticleList'
import {withRouter} from 'next/router'


function Home(props) {

    return (
        <ArticleList key={props.router.asPath} path={props.router.asPath}/>
    )
}

export default withRouter(Home)
