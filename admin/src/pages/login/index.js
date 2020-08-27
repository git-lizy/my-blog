import React,{useState,useEffect} from 'react';
import { Form, Input, Button, Checkbox,message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Style from './style.module.scss'
import { post } from '../../utils/requestUtil'

function Login(props) {
    const [loading,setLoading] = useState(false)
    let onFinish = values => {
        console.log('Success:', values);
        loginClick(values)
    };
    let onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    let loginClick=async(formValues)=>{
        const {account,password,remember} = formValues
        try {
            setLoading(true)
            let res = await post('/admin/login',{
                account,password,remember
            })
            console.log('res',res)
            setLoading(false)
            if(res.success){
                props.history.push('/admin')

                message.success('登录成功')
            }else{
                message.error('账号或密码错误')
            }

        }catch (e) {
            console.log('e',e)
            setLoading(false)
            message.error('登录失败')
        }
    }
    return <div className={Style.loginBody}>

        <div className={Style.loginMain}>
            <div className={Style.title}>
                <div className={'blog'}>小蚊子博客</div>
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
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入账号" />
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
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="请输入密码"
                    />
                </Form.Item>

                <Form.Item  name="remember" valuePropName="checked">
                    <Checkbox>记住我</Checkbox>
                </Form.Item>

                <Form.Item >
                    <Button loading={loading} type="primary" htmlType="submit"   className={Style.loginButton}>
                        登录
                    </Button>
                </Form.Item>
            </Form>

        </div>
        </div>


}

export default Login;
