/*文章列表管理页面*/
import React, { useState, useEffect } from 'react';
import {get, post} from "../../../utils/requestUtil";
import {Button, Col, Form, Input, message, Row, Select, Spin} from "antd";
import ipPort from '../../../common/ipPort'
import Style from './style.module.scss'
import moment from 'moment'
import EditTable from '../../../components/EditTable/index'

const {Option} = Select

function Index(props) {
    const [form] = Form.useForm()
    //页面加载状态
    const [pageLoading, setPageLoading] = useState(false)
    //文章类型数据源
    const [Typelist, setTypelist] = useState([])
    const [editingKey, setEditingKey] = useState('')

    useEffect(() => {
        getArticlTypeList({})
    }, []);

    //获取所有文章类型
    async function getArticlTypeList(values) {
        try {
            let res = await get(ipPort + '/default/articleType', values);
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.results.length) {
                setTypelist(res.results)
            } else {
                setTypelist([]);
            }

        } catch (e) {
            setTypelist([]);
            message.error(`获取文章类型失败,异常信息：${e}`)
        }

    }

    //删除文章类型
    async function deleteArticleType(row) {
        if (row.operation === 'add') {
            getArticlTypeList({})
        }else {
            try {
                let res = await post(ipPort + '/default/deleteArticleType', {Id : row.id });
                if (res.data === 'no-login') {
                    props.history.push('/')
                    return
                }
                if (res.success) {
                    message.success(`删除成功`)
                    getArticlTypeList({})
                } else {
                    message.error(`删除文章失败,异常信息：${res.code}`)
                }

            } catch (e) {
                message.error(`删除文章失败,异常信息：${e}`)
            }
        }
    }

    //点击查询按钮
    const query = (values) => {
        const {code, keywords} = values
        getArticlTypeList({code, keywords})
    }

    const handleAdd = () => {
        let Id = Number(Math.random().toString().substr(3, 18) + Date.now()).toString(36)

        setTypelist([
            ...Typelist,
            {
                id: Id,
                code: '',
                name: ``,
                remark: '',
                create_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                update_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                operation: 'add'
            }
        ])
        setEditingKey(Id)
    };

    return (
        <div className={Style.container}>
            <Form onFinish={query} layout={'vertical'} name="controrl-ref">
                <Row align={'middle'} gutter={30}>
                    <Col span={8}>
                        <Form.Item name="code" label="文章类型">
                            <Select
                                placeholder="请选择类型"
                                allowClear
                            >
                                {Typelist.map((item) => {
                                    return <Option key={item.code} value={item.code}>{item.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="keywords" label="关键字">
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{textAlign: 'left'}}>
                        <Button type={'primary'} htmlType={'submit'}>查询</Button>
                    </Col>
                </Row>
            </Form>
            <Spin spinning={pageLoading}>
                <Form form={form} component={false}>
                    <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                        新增
                    </Button>
                    <EditTable 
                    data={Typelist}
                    isSave={true}
                    isDelete={true}
                    editingKey={editingKey}
                    delete={deleteArticleType} />
                </Form>
            </Spin>        
        </div>
    );
}

export default Index;
