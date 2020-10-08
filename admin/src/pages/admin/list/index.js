import React, {useEffect, useState} from 'react';
import {get, post} from "../../../utils/requestUtil";
import {Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Spin, Table} from "antd";
import ipPort from '../../../common/ipPort'
import Style from './style.module.scss'
const {Option} = Select


function Index(props) {
    const [tableData, setTableData] = useState([]); //文章列表数据源
    const [pageLoading, setPageLoading] = useState(false)
    const [Typelist, setTypelist] = useState([]); //文章类型数据源

    useEffect(() => {
        getArticlList({})
        getArticlType()
    }, []);

    //获取所有文章类型
    async function getArticlType() {
        try {
            let res = await get(ipPort + '/default/articleType', {});
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.results.length) {
                setTypelist(res.results)
            } else {
                setTypelist([]);
                message.error(`获取文章类型失败,异常信息：${res.code}`)
            }

        } catch (e) {
            setTypelist([]);
            message.error(`获取文章类型失败,异常信息：${e}`)
        }

    }

    //获取指定条件文章列表
    async function getArticlList({type,page,keywords}) {

        setPageLoading(true)
        try {
            let res = await get(ipPort + '/default/articleList', {type,page,keywords});
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.results) {
                setTableData(res.results)
            } else {
                setTableData([]);
                message.error(`获取文章列表失败,异常信息：${res.code}`)
            }

        } catch (e) {
            setTableData([]);
            message.error(`获取文章列表失败,异常信息：${e}`)
        }
        setPageLoading(false)

    }

    //删除文章
    async function deleteArticle(articleId) {
        try {
            let res = await post(ipPort + '/admin/deleteArticle', {articleId});
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success) {
                message.success(`删除成功`)
                getArticlList()
            } else {
                message.error(`删除文章失败,异常信息：${res.code}`)
            }

        } catch (e) {
            message.error(`删除文章失败,异常信息：${e}`)
        }

    }

    const tableChange = (pagination) =>{
        console.log('page',pagination)
    }

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: '30%'
        },
        {
            title: '类别',
            dataIndex: 'type',
            key: 'type',
            width: '10%'
        },
        {
            title: '发布日期',
            dataIndex: 'create_date',
            key: 'create_date',
            width: '15%'
        },
        {
            title: '更新日期',
            dataIndex: 'update_date',
            key: 'update_date',
            width: '15%'
        },
        {
            title: '浏览量',
            key: 'hot',
            dataIndex: 'hot',
            width: '15%'
        },
        {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            width: '15%',
            render: (text, record) => (
                <>
                    <Space>
                        <Button type={'primary'} onClick={() => {
                            props.history.push(`/admin?articleId=${record.id}`)
                        }}>编辑</Button>
                        <Popconfirm title={'确定删除该文章吗'} cancelText={'取消'} okText={'确定'}
                                    onConfirm={deleteArticle.bind(Index, record.id)}>
                            <Button>删除</Button>
                        </Popconfirm>

                    </Space>

                </>
            ),
        },

    ];

    const query = (values) =>{
        const {type,keywords} = values
        getArticlList({type,keywords})
    }



    return (
        <div className={Style.container}>
            <Form onFinish={query} layout={'vertical'} name="controrl-ref">
                <Row align={'middle'}  gutter={30}>

                    <Col  span={8}>
                        <Form.Item name="type" label="文章类型" >
                            <Select
                                placeholder="请选择类型"
                                allowClear
                            >
                                {Typelist.map((item, index) => {
                                    return <Option key={item.name} value={item.name}>{item.name}</Option>
                                })}


                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item  name="keywords" label="关键字" >
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{textAlign:'center'}}>
                        <Button  type={'primary'} htmlType={'submit'}>查询</Button>
                    </Col>

                </Row>
            </Form>
            <Spin spinning={pageLoading}>
                <Table onChange={tableChange} columns={columns} dataSource={tableData}/>
            </Spin>
        </div>
    );

}


export default Index;
