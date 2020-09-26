import React, {memo} from 'react'
import {Col, Row} from 'antd'
import Qs from 'qs'
import {withRouter} from 'next/router'
import './style.scss'
import {connect} from 'react-redux'

const initMapStateToProps = (state) => {
    return {
        typeList: state.articleTypeList
    }
};

function NavBar(props) {
    const {typeList,path} = props;
    const query = path.lastIndexOf('?') > -1 ? Qs.parse(path.slice(path.lastIndexOf('?') + 1)) : {};
    const {type} = query;

    const typeClick = async (item) => {
        props.router.push(`/list?type=${item.name}`)

    };
    return <div className={'NavBar'}>
        <Row justify={'space-around'}>
            {typeList.map((item, index) => {
                return <Col onClick={() => {
                    typeClick(item)
                }} key={index} xs={6} sm={4} className={`NavBarItem ${type===item.name?'active':''}`}>{item.name}</Col>
            })}
        </Row>
    </div>
}

export default connect(initMapStateToProps)(memo(withRouter(NavBar)))
