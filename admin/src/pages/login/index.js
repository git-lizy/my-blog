//系统登录页
import React, {useState} from 'react';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import ipPort from '../../common/ipPort'
import Style from './style.module.scss'
import {post} from '../../utils/requestUtil'
import { setUserInfo } from '../../utils/Info'
import md5 from 'js-md5'

function Login(props) {
    //登录提交状态
    const [loading, setLoading] = useState(false);
    const onFinish = values => {
        loginClick(values)
    };
    //表单校验失败
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    //点击登录
    const loginClick = async (formValues) => {
        const {account, password, remember} = formValues;
        try {
            setLoading(true);
            let res = await post(ipPort + '/admin/login', {
                account, password: md5(password), remember
            });
            setLoading(false);
            if (res.success) {
                setUserInfo({ account: res.account, userId: res.userId })
                props.history.push('/admin')
                message.success('登录成功')
            } else {
                message.error('账号或密码错误')
            }

        } catch (e) {
            setLoading(false);
            message.error(`登录失败，异常信息为${e}`)
        }
    };
    return <div className={Style.loginBody}>

        <div className={Style.loginMain}>
            <div className={Style.title}>
                <div className={'blog'}>博客</div>
                <div className={'system'}>后台管理系统</div>
            </div>

            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="账号"
                    name="account"
                    rules={[
                        {
                            required: true,
                            message: '请输入账号',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="请输入账号"/>
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="请输入密码"
                    />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>记住我</Checkbox>
                </Form.Item>

                <Form.Item>
                    <Button loading={loading} type="primary" htmlType="submit" className={Style.loginButton}>
                        登录
                    </Button>
                </Form.Item>
            </Form>

        </div>
    </div>


}

export default Login;
