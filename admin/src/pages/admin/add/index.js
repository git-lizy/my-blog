import React, {useState,useEffect} from 'react';
import {get} from "../../../utils/requestUtil";
import {message} from "antd";
import ipPort from '../../../common/ipPort'

function Index (props) {
    useEffect(()=>{
        getArticleList()
    },[])
    let getArticleList=async (type,page)=>{
        try {
            let res = await get(ipPort+'/admin/getArticleList',{})
            if(res.data==='no-login'){
                props.history.push('/')
            }
            if(res.length){

            }else{

            }

        }catch (e) {
            message.error('获取数据失败')

        }

    }
        return (
            <div>
                发布文章
            </div>
        );

}



export default Index;
