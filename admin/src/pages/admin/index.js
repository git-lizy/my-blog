/*路由页面公共父组件容器*/
import React, {useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Route} from 'react-router-dom'
import {Layout, Menu, Row, Col, Modal, message } from 'antd';
import {FileOutlined, PieChartOutlined} from '@ant-design/icons';
import Style from './style.module.scss'
import { getUserInfo, setUserInfo } from '../../utils/Info';
import {post} from "../../utils/requestUtil";
import ipPort from '../../common/ipPort'

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;
const { confirm } = Modal;

function Index(props) {
    const search = props.location.search
    //侧边栏折叠状态
    const [collapsed, setCollapsed] = useState(false);

    const [Info, setInfo] = useState(getUserInfo() || {})

    const { pathname } = useLocation();

    const [activeKey, setActiveKey] = useState('fbwz')

    useEffect( () => {
        console.log(pathname)
        switch(pathname) {
            case '/admin/list' :
                setActiveKey('wzlb')
                break;
            case '/admin/type' :
                setActiveKey('wzlx')
                break;
            case '/admin/message' :
                setActiveKey('lygl')
                break;
            default: 
                setActiveKey('fbwz')
                break;
        }
    }, [pathname])

    //点击折叠按钮
    let onCollapse = collapsed => {
        setCollapsed(collapsed)
    };
    //菜单按钮点击
    let menuClick = ({item, key, keypath, selectedKey}) => {
        //发布文章
        if (key === 'fbwz') {
            props.history.push('/admin')
        }
        //文章列表
        if (key === 'wzlb') {
            props.history.push('/admin/list')
        }
        //文章类型
        if (key === 'wzlx') {
            props.history.push('/admin/type')
        }
        //留言管理
        if (key === 'lygl') {
            props.history.push('/admin/message')
        }
    };

    const handleLogout = () => {
        let { userId } = getUserInfo()
        confirm({
            title: '提示',
            content: '确认退出登录吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                try {
                    let res = await post(ipPort + '/admin/logout', {userId});
                    //校验登录状态
                    if (res.data === 'no-login') {
                        props.history.push('/')
                        return
                    }
                    if (res.success) {
                        props.history.push('/')
                        setUserInfo({})
                    } else {
                        message.error(`退出登录失败,异常信息：${res.code}`)
                    }
                } catch (e) {
                    message.error(`退出登录失败,异常信息：${e}`)
                }
            }
        })
    }

    return (
        <>
            <Layout style={{minHeight: '100vh'}}>
                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    {!collapsed &&
                    <div className={Style.logo}>
                        <div className={'blog'} style={{textAlign:'center'}}>博客</div>
                        <div className={'system'} style={{textAlign:'center'}}>个人博客管理系统</div>
                    </div>
                    }
                    <Menu onClick={menuClick} theme="dark" mode="inline" defaultOpenKeys={['sub1']} selectedKeys={[activeKey]}>
                        <SubMenu icon={<FileOutlined/>} title="文章管理" key='sub1'>
                            <Menu.Item key="fbwz">发布文章</Menu.Item>
                            <Menu.Item key="wzlb">文章列表</Menu.Item>
                            <Menu.Item key="wzlx">文章类型</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="lygl" icon={<PieChartOutlined/>}>
                            留言管理
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header>
                        <Row className="header-row">
                            <Col span={4} className="col">
                                <div className="right">
                                    <ul>
                                    <li>
                                        <a >{Info.account}</a>
                                    </li>
                                    <li>
                                        <a onClick={handleLogout}>退出</a>
                                    </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row> 
                    </Header>
                    <Content style={{margin: '0 16px'}}>
                        {props.child.map(item => {
                            return <Route exact={item.exact} key={item.path + search} path={item.path}
                                          render={props => <item.component {...props} />}/>
                        })}
                    </Content>
                    {/* <Footer style={{textAlign: 'center'}}>个人博客</Footer> */}
                </Layout>
            </Layout>
        </>
    );
}

export default Index;
