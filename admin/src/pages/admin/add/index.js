/*发布文章页面*/
import React, {useEffect, useRef, useState } from 'react';
import {get, post} from "../../../utils/requestUtil";
import {Button, Col, Form, Input, message, Row, Select, Spin, Radio} from "antd";
import url from 'url'
// import ImageUpload from '../../../components/ImageUpload'
import Editor from '../../../components/Editor'
import {PlusCircleOutlined} from '@ant-design/icons';
import ipPort from '../../../common/ipPort'
// import highLight from 'highlight.js'
//import marked from 'marked'
import Style from './style.module.scss'
import { getUserInfo } from '../../../utils/Info';
//import './preview.scss'
//import 'highlight.js/styles/monokai-sublime.css'
//import {postFile} from "../../../utils/requestUtil";

const {Option} = Select;

function Index(props) {
    const search = props.location.search
    //获取get参数
    const query = url.parse(search, true).query
    //页面加载状态
    const [pageLoading, setPageLoading] = useState(false)
    //表单初始值
    const [initialValues, setInitialValues] = useState('')
    //提交按钮的文本值
    const [submitText, setSubmitText] = useState('发布文章')
    //文章类型数据源
    const [Typelist, setTypelist] = useState([]);
    //文章预览内容
    //const [preview, setPreview] = useState('');
    //表单提交加载状态
    const [submitLoading, setSubmitLoading] = useState(false);
    //当前文章articleId
    const [articleId, setArticleId] = useState(query.articleId ? query.articleId : '');
    //当前文章内容数据
    const [initData, setInitData] = useState('------\n');
    //表单引用
    const formRef = useRef();
    
    const [first, setFirst] = useState(false);
    //markdown转html效果配置
    //const renderer = new marked.Renderer();
    // marked.setOptions({
    //     renderer: renderer,
    //     gfm: true,
    //     pedantic: false,
    //     sanitize: false,
    //     tables: true,
    //     breaks: false,
    //     smartLists: true,
    //     smartypants: false,
    //     highlight: function (code) {
    //         return highLight.highlightAuto(code).value;
    //     }
    // });
    
    useEffect(() => {
        //判断是编辑还是新建从而是否新建文章id
        if (!articleId) {
            getRandomArticleId()
            setInitialValues({
                title: '', type: '',content: '',introduce: '',visible: 1
            })
        } else {
            setSubmitText('更新文章')
            getArticleDetail(articleId, false)
        }
        getArticlType()
    }, []);

    //模式为编辑时获取文章数据
    async function getArticleDetail(id, shouldUpdate) {
        setPageLoading(true);
        try {
            let res = await get(ipPort + '/admin/articleDetail', {id, update: shouldUpdate});
            setPageLoading(false);
            //校验登录状态
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.results.length) {
                //赋值初始值
                const {title, type, introduce, content, visible} = res.results[0]
                setInitialValues({
                    title,
                    type,
                    content,
                    introduce,
                    visible
                })
                setInitData(content)
                setFirst(true)
            } else {
                message.error(`获取文章详情失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setPageLoading(false)
            message.error(`获取文章详情失败，异常信息为：${e}`)
        }
    }

    //获取所有文章类型
    async function getArticlType() {
        try {
            let res = await get(ipPort + '/default/articleType', {});
            //校验登录状态
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

    //获取随机文章id进行绑定当前文章
    async function getRandomArticleId() {
        try {
            let res = await get(ipPort + '/admin/getRandomArticleId', {});
            //校验登录状态
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.articleId) {
                setArticleId(res.articleId)
                setFirst(true)
            } else {
                setArticleId('')
                message.error(`新建文章id失败,异常信息：${res.code}`)
            }
        } catch (e) {
            setArticleId('')
            message.error(`新建文章id失败,异常信息：${e}`)
        }
    }

    //文章内容输入改变时
    //const contentChange = (e) => {
        //console.log(e.target.value, articleId)
        //setPreview(marked(e.target.value))
    //};

    //点击提交按钮
    const submit = async (values) => {
        const {title, type, introduce, visible} = values
        const apiPath = submitText === '发布文章' ? '/admin/releaseArticle' : '/admin/updateArticle'
        setSubmitLoading(true);
        const { userId } = getUserInfo()
        let content = window.$(".editormd-markdown-textarea").val() || '';
        try {
            let res = await post(ipPort + apiPath, {
                userId,
                articleId,
                title,
                type,
                content,
                introduce,
                visible
            })     
            //校验登录状态
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success) {
                message.success(submitText === '发布文章' ? '发布文章成功' : '更新文章成功')
                props.history.push('/admin/list')
            } else {
                message.error(`发布失败，异常信息为${res.code}`)
            }

        } catch (e) {
            message.error(`发布失败，异常信息为${e}`)
        }
        setSubmitLoading(false)
    }

    return (
        <div className={Style.container}>
            <Spin spinning={pageLoading}>
                <Form key={initialValues} initialValues={initialValues} onFinish={submit} layout={'vertical'}
                      scrollToFirstError ref={ele => {
                    formRef.current = ele
                }} name="controrl-ref">
                    <Row>

                        <Col span={13} className={'padRight'}>
                            <Form.Item name="title" label="文章标题" rules={[{required: true, message: '请输入标题'}]}>
                                <Input placeholder="请输入标题"/>
                            </Form.Item>
                        </Col>

                        <Col span={5} className={'padRight'}>
                            <Form.Item name="type" label="类型" rules={[{required: true, message: '请选择类型'}]}>
                                <Select
                                    placeholder="请选择类型"
                                    onChange={() => {
                                    }}
                                    allowClear
                                >
                                    {Typelist.map((item, index) => {
                                        return <Option key={index} value={item.name}>{item.name}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>


                        <Col span={5} className={`padRight ${Style.releaseCol}`}>
                            <Button loading={submitLoading} icon={<PlusCircleOutlined/>} type={'primary'}
                                    htmlType="submit" size={'large'}>{submitText}</Button>
                        </Col>

                    </Row>

                    <Row>
                        <Col span={13} className={'padRight'}>
                            <Form.Item name="introduce" label="文章介绍" rules={[{required: true, message: '请输入文章介绍'}]}>
                                <Input.TextArea className={Style.content} autoSize={{minRows: 1}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6} className={'padRight'}>
                            <Form.Item name="visible" label="状态">
                                <Radio.Group name="radiogroup" defaultValue={initialValues.visible}>
                                    <Radio value={1}>公开</Radio>
                                    <Radio value={0}>仅自己可见</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Editor articleId={articleId} initData={initData} first={first} ></Editor>
                        {/* <Col span={9} className={'padRight'}>
                            <Form.Item name="content" label="文章内容" rules={[{required: true, message: '请输入文章内容'}]}>
                                <Input.TextArea className={Style.content} autoSize={{minRows: 20}}
                                        value={contentVal}  onChange={contentChange}/>
                            </Form.Item>
                        </Col>

                        <Col span={9} className={'padRight'}>
                            <div className={Style.previewText}>预览</div>
                            <div id={'preview'} className={Style.preview} dangerouslySetInnerHTML={{__html: preview}}>

                            </div>

                        </Col>
                        <Col span={6} className={''}>
                            <Form.Item name="introduce" label="文章介绍" rules={[{required: true, message: '请输入文章介绍'}]}>
                                <Input.TextArea className={Style.content} autoSize={{minRows: 3}}/>
                            </Form.Item>

                            <div>
                                <div>所需图片上传</div>
                                <ImageUpload articleId={articleId} uploadChange={uploadChange}/>
                            </div>

                        </Col> */}
                    </Row>
                </Form>
            </Spin>
        </div>
    )
}


export default Index;