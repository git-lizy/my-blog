import React, {memo} from 'react'
import {Col, Row} from 'antd'
import {withRouter,} from 'next/router'
import './style.scss'
import {connect} from 'react-redux'

const initMapStateToProps = (state) => {
    return {
        typeList: state.articleTypeList
    }
};

function NavBar(props) {
    const {typeList} = props;

    const typeClick = async (item) => {
        props.router.push(`/list?type=${item.name}`)

    };
    return <div className={'NavBar'}>
        <Row justify={'space-around'}>
            {typeList.map((item, index) => {
                return <Col onClick={() => {
                    typeClick(item)
                }} key={index} xs={6} sm={4} className={'NavBarItem'}>{item.name}</Col>
            })}
        </Row>
    </div>
}

export default connect(initMapStateToProps)(memo(withRouter(NavBar)))
