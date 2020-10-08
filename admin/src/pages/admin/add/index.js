import React, {useEffect, useRef, useState} from 'react';
import {get, postFile,post} from "../../../utils/requestUtil";
import {Button, Col, Form, Input, message, Modal, Row, Select,Rate,Spin} from "antd";
import url from 'url'
import ImageUpload from '../../../components/ImageUpload'
import {PlusCircleOutlined,} from '@ant-design/icons';
import ipPort from '../../../common/ipPort'
import highLight from 'highlight.js'
import marked from 'marked'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css
import 'highlight.js/styles/monokai-sublime.css'
import Style from './style.module.scss'
import './preview.scss'

const {Option} = Select;

function Index(props) {

    const search = props.location.search
    //获取get参数
    const query = url.parse(search,true).query
    const [pageLoading,setPageLoading] = useState(false)
    const [initialValues,setInitialValues] = useState('')
    const [submitText,setSubmitText] = useState('发布文章')
    const [Typelist, setTypelist] = useState([]); //文章类型数据源
    const [preview, setPreview] = useState('');
    const [dataUrl, setDataUrl] = useState(''); //裁剪前封面
    const [filePath, setFilePath] = useState(''); //上传后的封面地址
    const coverFile = useRef(); //裁剪后封面的文件对象
    const [cropperModal, setCropperModal] = useState(false); //裁剪弹窗显隐
    const [uploadLoading, setUploadLoading] = useState(false); //封面上传加载状态
    const [submitLoading, setSubmitLoading] = useState(false); //表单体提交加载状态
    const [uploadStatus, setUploadStatus] = useState(false); //当前封面是否已上传
    const [articleId,setArticleId] = useState(query.articleId?query.articleId:'') //生成的文章id
    const cropperObj = useRef();
    const fileInput = useRef(); //上传表单元素
    const formRef = useRef(); //表单引用
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader(file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result)
            };
            reader.onerror = (error) => {
                reject(error)
            }
        })
    };
    const dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    };
    const renderer = new marked.Renderer();
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            return highLight.highlightAuto(code).value;
        }
    });
    useEffect(() => {

        //判断是编辑还是新建从而是否新建文章id
        console.log('articleId',articleId)
        if(!articleId){
            getRandomArticleId()
        }else{
            setSubmitText('更新文章')
            getArticleDetail(articleId,false)
        }
        getArticlType()
    }, []);

    //模式为编辑时获取文章数据
    async function getArticleDetail(id,shouldUpdate) {
        setPageLoading(true);
        try {
            let res = await get(ipPort + '/admin/articleDetail', {id,update:shouldUpdate});
            setPageLoading(false);
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.results.length) {
                //赋值初始值
                const {title,type,introduce,content,cover_path,recommend} = res.results[0]
                setInitialValues({
                    title,
                    type,
                    content,
                    introduce,
                    recommend:recommend.length,
                    cover:cover_path
                })
                setPreview(marked(content))
                setFilePath(cover_path)
            } else {
                setInitialValues({});
                message.error(`获取文章详情失败，异常信息为：${res.code}`)
            }
        } catch (e) {
            setPageLoading(false);
            setInitialValues({});
            message.error(`获取文章详情失败，异常信息为：${e}`)
        }

    }

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

    //获取随机文章id进行绑定当前文章
    async function getRandomArticleId() {
        try {
            let res = await get(ipPort + '/admin/getRandomArticleId', {});
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success && res.articleId) {
                setArticleId(res.articleId)
            } else {
                setArticleId('');
                message.error(`新建文章id失败,异常信息：${res.code}`)
            }

        } catch (e) {
            setArticleId('');
            message.error(`新建文章id失败,异常信息：${e}`)
        }

    }

    const contentChange = (e) => {
        setPreview(marked(e.target.value))
    };
    const fileChange = async (e) => {
        e.persist();
        if (!e.target.files[0]) return;
        const dataUrl = await fileToBase64(e.target.files[0]);
        setDataUrl(dataUrl);
        setCropperModal(true)


    };

    const modalOk = () => {
        //获取裁剪后的base64数据
        const croppedBase64 = cropperObj.current.cropper.getCroppedCanvas().toDataURL();

        setCropperModal(false);
        setUploadStatus(false);
        //base64转file对象
        coverFile.current = dataURLtoFile(croppedBase64, `封面.png`)

        uploadClick()
    };
    const modalCancel = () => {
        setCropperModal(false)
    };

    const uploadClick = async () => {
        setUploadLoading(true);
        try {
            let res = await postFile(ipPort + '/admin/upload', {
                file: coverFile.current,
                articleId:articleId,
                isCover:true,//是否为封面（用于删除旧有封面）
                oldPath:filePath,//前一张封面的服务器路径地址（用于删除旧有封面）
            });
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success) {
                setUploadStatus(true);
                //设置表单值
                formRef.current.setFieldsValue({'cover': true})
                setFilePath(res.path)
                message.success('上传成功')
            } else {
                setUploadStatus(false);
                message.error(`上传失败，异常信息为${res.code}`)
            }

        } catch (e) {
            setUploadStatus(false);
            message.error(`上传失败，异常信息为${e}`)
        }
        setUploadLoading(false)
    };

    const submit = async(values) => {
        // const {}
        console.log('values',values)
        const {content,title,type,introduce,recommend} = values
        const apiPath = submitText === '发布文章'?'/admin/releaseArticle':'/admin/updateArticle'
        setSubmitLoading(true);
        try {
            let res = await post(ipPort + apiPath, {

                articleId,
                title,
                type,
                recommend:String(recommend),
                content,
                coverPath:filePath,
                introduce
            });
            if (res.data === 'no-login') {
                props.history.push('/')
                return
            }
            if (res.success) {
                message.success('发布成功')
                props.history.push('/admin/list')
            } else {
                message.error(`发布失败，异常信息为${res.code}`)
            }

        } catch (e) {
            message.error(`发布失败，异常信息为${e}`)
        }
        setSubmitLoading(false)
    }

    useEffect(()=>{
        console.log('initialValues',initialValues)
    },[initialValues])

    return (
        <div className={Style.container}>
            <Spin spinning={pageLoading}>
            <Form key={initialValues} initialValues={initialValues}  onFinish={submit}  layout={'vertical'} scrollToFirstError ref={ele => {formRef.current = ele}} name="controrl-ref" >
                <Row>

                    <Col span={11} className={'padRight'}>
                        <Form.Item  name="title" label="文章标题" rules={[{required: true,message:'请输入标题'}]}>
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                    </Col>

                    <Col span={4} className={'padRight'}>
                        <Form.Item name="type" label="类型" rules={[{required: true,message:'请选择类型'}]}>
                            <Select
                                placeholder="请选择类型"
                                onChange={() => {
                                }}
                                allowClear
                            >
                                {Typelist.map((item, index) => {
                                    return <Option key={item.name} value={item.name}>{item.name}</Option>
                                })}


                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={4} className={'padRight'}>
                        <Form.Item name="recommend" label="推荐指数" rules={[{required: true,message:'请选择推荐指数'}]}>
                           <Rate/>
                        </Form.Item>
                    </Col>

                    <Col span={5} className={`padRight ${Style.releaseCol}`}>
                        <Button loading={submitLoading} icon={<PlusCircleOutlined/>} type={'primary'} htmlType="submit" size={'large'} >{submitText}</Button>
                    </Col>

                </Row>

                <Row>

                    <Col span={9} className={'padRight'}>
                        <Form.Item name="content" label="文章内容" rules={[{required: true,message:'请输入文章内容'}]}>
                            <Input.TextArea className={Style.content} autoSize={{minRows: 20}}
                                            onChange={contentChange}/>
                        </Form.Item>
                    </Col>

                    <Col span={9} className={'padRight'}>
                        <div className={Style.previewText}>预览</div>
                        <div id={'preview'} className={Style.preview} dangerouslySetInnerHTML={{__html: preview}}>

                        </div>

                    </Col>
                    <Col span={6} className={''}>
                        <Form.Item name="introduce" label="文章介绍" rules={[{required: true,message:'请输入文章介绍'}]}>
                            <Input.TextArea className={Style.content} autoSize={{minRows: 3}} />
                        </Form.Item>

                        <Form.Item name="cover" label="封面上传" rules={[{required: true,message:'请上传封面'}]}>
                            <div className={filePath ? Style.coverView : ''}>
                                {filePath ? <img src={ipPort+filePath} alt=""/> : null}
                            </div>
                            <div className={Style.coverButtons}>
                                <Button type={'primary'} onClick={() => {
                                    fileInput.current.click()
                                }}>{'选择封面'}</Button>

                                {uploadStatus ? <Button loading={uploadLoading} disabled={true} >{uploadLoading?'上传中':'已上传'}</Button> : null}
                            </div>

                            <input ref={(ele) => {
                                fileInput.current = ele
                            }} type="file" accept={"image/*"} style={{display: 'none'}} onChange={fileChange}/>
                            <Modal
                                title="封面预览"
                                visible={cropperModal}
                                maskClosable={false}
                                onOk={modalOk}
                                okText={'确定'}
                                cancelText={'取消'}
                                onCancel={modalCancel}
                            >
                                <Cropper
                                    src={dataUrl}
                                    style={{}}
                                    ref={cropper => cropperObj.current = cropper}
                                    viewMode={1}
                                    zoomable={false}
                                    aspectRatio={2} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
                                    guides={false}
                                    preview={`.${Style.cropperPreview}`}
                                    // dragMode={'move'}
                                    minCropBoxWidth={200}
                                    // maxCropBoxHeight={100}
                                    // minCanvasHeight={100}
                                />
                                <div className="preview-container">
                                    <div>预览</div>
                                    <div className={Style.cropperPreview}/>
                                </div>
                            </Modal>


                        </Form.Item>


                        <div>
                            <div>其他图片上传</div>
                            <ImageUpload articleId={articleId}/>
                        </div>


                    </Col>
                </Row>
            </Form>
            </Spin>
        </div>
    );

}


export default Index;
