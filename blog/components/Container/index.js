import React, {memo, useEffect} from 'react'
import Header from '../Header'
import NavBar from '../NavBar'
import SideBar from '../SideBar'
import Location from '../Location'
import Footer from '../Footer'
import {withRouter} from 'next/router'
import {Col, Row} from 'antd'
import {connect} from 'react-redux'
import {GET_TYPE} from '../../store/action'
import './style.scss'


const initMapDispatchToProps = (dispath) => {
    return {
        getTypeList(data) {
            dispath(GET_TYPE(data))
        },
    }
};
const initMapStateToProps = (state) => {
    return {
        typeList: state.articleTypeList
    }
};

function Container(props) {
    const {typeList} = props;
    useEffect(() => {
        props.getTypeList()
    }, []);

    return <>
        <Header/>
        <NavBar/>
        <Row className={'containerMainRow'}>
            <Col xs={24} sm={24} md={19}>
                {typeList.length && <Location key={props.router.asPath} path={props.router.asPath}/>}
                <div className={'children'}>
                    {props.children}
                </div>


            </Col>
            <Col xs={0} sm={0} md={5}>
                <SideBar/>
            </Col>
        </Row>
        <Footer/>
    </>
}

export default connect(initMapStateToProps, initMapDispatchToProps)(withRouter(memo(Container)))
