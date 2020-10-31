/*
* 图片上传组件
* 开发者：scw
* 开发日期：2020-09-12
* 上次修改日期：2020-10-31
* */
import React, {useEffect, useRef, useState} from 'react';
import {message, Modal, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {postFile} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";


function ImageUpload(props) {
    //图片上传预览弹窗显隐
    const [previewVisible, setPreviewVisible] = useState(false);
    //图片上传预览弹窗图片地址
    const [previewImage, setPreviewImage] = useState('');
    ////图片上传预览弹窗标题
    const [previewTitle, setPreviewTitle] = useState('');
    //当前上传图片的服务器地址
    const [currentUploadPath, setCurrentUploadPath] = useState('');
    //当前图片列表数据源
    const [fileList, setFileList] = useState([]);
    //当前图片列表数据源的图片数量
    const fileListNumber = useRef(0);

    //页面加载完成后
    useEffect(() => {
    }, []);

    //图片预览弹窗点击取消
    const handleCancel = () => {
        setPreviewVisible(false)
    };
    //点击预览按钮
    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    //将file对象转成base64
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    //组件的图片数量发生变化
    const handleChange = ({file, fileList}) => {
        const newFileList = JSON.parse(JSON.stringify(fileList));
        const currentLength = newFileList.length;
        if (currentLength >= 1) {
            newFileList[newFileList.length - 1].status = 'done'

        }
        //表示上传文件而非删除
        if (currentLength > fileListNumber.current) {
            newFileList[newFileList.length - 1].url = ipPort + currentUploadPath
            newFileList[newFileList.length - 1].path = currentUploadPath
        }
        fileListNumber.current = currentLength;
        setFileList(newFileList)


    };
    //图片真正上传到服务器前（返回true或promise为resolve则上传）
    const beforeUpload = async (file, fileList) => {
        // console.log('file', file, fileList);
        try {
            let res = await postFile(ipPort + '/admin/upload', {
                file: file,
                articleId: props.articleId,
            });
            if (res.success) {
                // console.log('res.path', res.path)
                setCurrentUploadPath(res.path);
                return true
            } else {
                setCurrentUploadPath('');
                message.error(`上传失败,异常信息：${res.code}`);
                return false
            }

        } catch (e) {
            setCurrentUploadPath('');
            message.error(`上传失败,异常信息：${e}`);
            return false
        }


    };
    //图片真正从服务器删除前（返回true或promise为resolve则删除）
    const beforeRemove = async (file) => {
        // console.log('file', file)
        try {
            let res = await postFile(ipPort + '/admin/delete', {
                oldPath: file.path,//删除的图片服务器路径地址
            });
            if (res.success) {
                return true
            } else {
                message.error(`删除失败，异常信息为${res.code}`)
                return false
            }

        } catch (e) {
            message.error(`删除失败，异常信息为${e}`)
            return false
        }

    };

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                onRemove={beforeRemove}
            >
                {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="preview" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
}

export default ImageUpload;
