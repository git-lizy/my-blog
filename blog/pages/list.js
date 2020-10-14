import React from 'react'
import ArticleList from '../components/ArticleList'
import {withRouter} from 'next/router'
import Qs from 'qs'
import {get} from "../utils/requestUtil";
import ipPort from "../common/ipPort";


function Home(props) {
    const {initialList} = props;

    return (
        <ArticleList  initialList={initialList} key={props.router.asPath} path={props.router.asPath}/>
    )
}

Home.getInitialProps = async(ctx)=>{
    const {asPath:path}=ctx
    let query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    let type = path.startsWith('/list') ? query.type : undefined;
    let keywords = path.startsWith('/list') ? query.keywords : undefined;
    try{
        let res = await get(ipPort + '/default/articleList', {type, page:1,keywords});
        if (res.success) {

            return {initialList:res.results}
        } else {
            return {initialList:[]}
        }
    }catch (e) {
        return {initialList:[]}
    }

}

export default withRouter(Home)
