import React,{} from 'react'
import { Row , Col } from 'antd'
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import './error.scss'
import {withRouter} from 'next/router'



function Error(props) {
    let backToIndex=()=>{
        props.router.push('/')
    }
    return (
        <div className="container">
            <Header />
            <NavBar />
                <div className={'errorContainer'}>
                    <div>
                        <div className={'errorIcon'}></div>
                        <div>页面走丢了</div>
                        <a onClick={backToIndex.bind(Error)}>返回首页</a>
                    </div>

                </div>



            <Footer/>
        </div>
    )
}
export default withRouter(Error)
