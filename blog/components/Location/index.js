/*
* 组件名称：当前位置导航
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {useEffect, useState} from 'react'
import {Breadcrumb, Col, message} from 'antd'
import Qs from 'qs'
import {withRouter} from 'next/router'
import './style.scss'
import {get} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";


function Location(props) {
    // console.log('location的router',props)
    const [locations, setLocations] = useState([]);
    const {path, typeList} = props;
    const jingHaoIndex = path.lastIndexOf('#') > -1 ? path.lastIndexOf('#') : false
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1, jingHaoIndex ? jingHaoIndex : path.length)) : {};
    // console.log('queryyy',query)
    const {type, id, keywords} = query;

    useEffect(() => {
        const func = async () => {
            let newList = [];
            if (path === '/') {
                newList[0] = {name: '首页', path: '/'};
            } else if (path.startsWith('/list?type')) {
                if (type && typeList.find(item => item.name === type)) {
                    newList[0] = {name: '首页', path: '/'};
                    newList[1] = {name: type, path: `/list?type=${type}`}
                } else {
                    newList[0] = {name: '首页', path: '/'};
                }
            } else if (path.startsWith('/list?keywords')) {
                newList[0] = {name: '首页', path: '/'};
                newList[1] = {name: '搜索结果', path: `/list?keywords=${keywords}`}

            } else if (path.startsWith('/detail?id')) {
                if (id) {
                    let res = await getOtherMsgById(id);
                    newList[0] = {name: '首页', path: '/'};
                    newList[1] = {name: res.type, path: `/list?type=${res.type}`};
                    newList[2] = {name: res.title, path: `/detail?id=${res.id}`}
                }
            } else {
                newList[0] = {name: '首页', path: '/'};
            }
            setLocations(newList)
        };
        func()

    }, []);

    //根据id查询非文章内容的其他信息
    async function getOtherMsgById(id) {
        // console.log('getOtherMsgById');
        try {
            let res = await get(ipPort + '/default/otherMsgById', {id});
            if (res.success && res.results.length) {
                return res.results[0]
            } else {
                message.error(`获取文章信息失败，异常信息为：${res.code}`);
                return {}
            }
        } catch (e) {
            message.error(`获取文章信息失败，异常信息为：${e}`);
            return {}

        }

    }

    return <Col className={'Location'} xs={0} sm={0} md={24}>
        <span>当前位置：</span>
        <Breadcrumb separator=">" style={{display: 'inline-block'}}>
            {locations.map((item, index) => {
                return <Breadcrumb.Item key={index} onClick={() => {
                    props.router.push(item.path)
                }}>{item.name}</Breadcrumb.Item>
            })}
        </Breadcrumb>

    </Col>
}

Location.defaultProps = {
    locations: []
};
export default (withRouter(Location))
