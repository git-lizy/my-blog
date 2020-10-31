/*路由页面公共父组件容器*/
import React, {useState} from 'react';
import {Route} from 'react-router-dom'
import {Layout, Menu} from 'antd';
import {FileOutlined, PieChartOutlined,} from '@ant-design/icons';
import Style from './style.module.scss'

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


function Index(props) {
    const search = props.location.search
    //侧边栏折叠状态
    const [collapsed, setCollapsed] = useState(false);


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
        //留言管理
        if (key === 'lygl') {
            props.history.push('/admin/message')
        }
    };

    return (
        <>

            <Layout style={{minHeight: '100vh'}}>

                <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                    {!collapsed &&
                    <div className={Style.logo}>
                        <div className={'blog'}>铸心博客</div>
                        <div className={'system'}>后台管理系统</div>
                    </div>
                    }
                    <Menu onClick={menuClick} theme="dark" mode="inline">

                        <SubMenu icon={<FileOutlined/>} title="文章管理">
                            <Menu.Item key="fbwz">发布文章</Menu.Item>
                            <Menu.Item key="wzlb">文章列表</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="lygl" icon={<PieChartOutlined/>}>
                            留言管理
                        </Menu.Item>

                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content style={{margin: '0 16px'}}>
                        {props.child.map(item => {
                            return <Route exact={item.exact} key={item.path + search} path={item.path}
                                          render={props => <item.component {...props} />}/>
                        })}
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Powered By Antd & React</Footer>
                </Layout>
            </Layout>
        </>
    );
}

export default Index;
