import React, {useEffect, useRef, useState} from 'react';
import {get, postFile} from "../../../utils/requestUtil";
import {Button, Col, Form, Input, message, Modal, Row, Select} from "antd";
import ImageUpload from '../../../components/ImageUpload'
import {PlusCircleOutlined,} from '@ant-design/icons';
import ipPort from '../../../common/ipPort'
import highLight from 'highlight.js'
import marked from 'marked'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css
import 'highlight.js/styles/monokai-sublime.css'
import Style from './style.module.scss'

const {Option} = Select;

function Index(props) {
    const [Typelist, setTypelist] = useState([]); //文章类型数据源
    const [preview, setPreview] = useState('');
    const [dataUrl, setDataUrl] = useState(''); //裁剪前封面
    const [croppedDataUrl, setCroppedDataUrl] = useState(''); //裁剪后封面
    const [coverFile, setCoverFile] = useState(''); //裁剪后封面的文件对象
    const [cropperModal, setCropperModal] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(false); //当前封面是否已上传
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
        getArticlType()
    }, []);

    //获取所有文章类型
    async function getArticlType() {
        try {
            let res = await get(ipPort + '/default/articleType', {});
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

    const contentChange = (e) => {
        setPreview(marked(e.target.value))
    };
    const fileChange = async (e) => {
        e.persist();
        if (!e.target.files[0]) return;
        const dataUrl = await fileToBase64(e.target.files[0]);
        // console.log('dataUrl',dataUrl)
        setDataUrl(dataUrl);
        setCropperModal(true)


    };

    const modalOk = () => {
        //获取裁剪后的base64数据
        const croppedBase64 = cropperObj.current.cropper.getCroppedCanvas().toDataURL();

        setCropperModal(false);
        setUploadStatus(false);
        setCroppedDataUrl(croppedBase64);
        //base64转file对象
        setCoverFile(dataURLtoFile(croppedBase64, `封面.png`));
        //设置表单值
        formRef.current.setFieldsValue({'cover': true})
    };
    const modalCancel = () => {
        setCropperModal(false)
    };

    const uploadClick = async () => {
        setUploadLoading(true);
        try {
            let res = await postFile(ipPort + '/admin/upload', {file: coverFile});
            if (res.success) {
                setUploadStatus(true);
                setCoverFile(ipPort+res.path)
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

    return (
        <div className={Style.container}>
            <Form layout={'vertical'} ref={ele => {
                formRef.current = ele
            }} name="controrl-ref" onFinish={() => {
            }}>
                <Row>

                    <Col span={12} className={'padRight'}>
                        <Form.Item name="title" label="文章标题" rules={[{required: true}]}>
                            <Input placeholder="请输入标题"/>
                        </Form.Item>
                    </Col>

                    <Col span={6} className={'padRight'}>
                        <Form.Item name="type" label="类型" rules={[{required: true}]}>
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

                    <Col span={6} className={`padRight ${Style.releaseCol}`}>
                        <Button icon={<PlusCircleOutlined/>} type={'primary'} size={'large'} onClick={() => {
                        }}>发布文章</Button>
                    </Col>

                </Row>

                <Row>

                    <Col span={9} className={'padRight'}>
                        <Form.Item name="content" label="文章内容" rules={[{required: true}]}>
                            <Input.TextArea className={Style.content} autoSize={{minRows: 20}}
                                            onChange={contentChange}/>
                        </Form.Item>
                    </Col>

                    <Col span={9} className={'padRight'}>
                        <div className={Style.previewText}>预览</div>
                        <div className={Style.preview} dangerouslySetInnerHTML={{__html: preview}}>

                        </div>

                    </Col>
                    <Col span={6} className={''}>
                        <Form.Item name="introduce" label="文章介绍" rules={[{required: true}]}>
                            <Input.TextArea className={Style.content} autoSize={{minRows: 3}} onChange={contentChange}/>
                        </Form.Item>

                        <Form.Item name="cover" label="封面上传" rules={[{required: true}]}>
                            <div className={croppedDataUrl ? Style.coverView : ''}>{croppedDataUrl ?
                                <img src={croppedDataUrl} alt=""/> : null}</div>
                            <div className={Style.coverButtons}>
                                <Button type={'primary'} onClick={() => {
                                    fileInput.current.click()
                                }}>选择封面</Button>

                                {croppedDataUrl ? <Button disabled={uploadStatus} loading={uploadLoading}
                                                          onClick={uploadClick}>{uploadStatus ? '已上传' : '上传'}</Button> : null}
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
                            <ImageUpload/>
                        </div>


                    </Col>
                </Row>
            </Form>

        </div>
    );

}


export default Index;
