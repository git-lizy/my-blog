import React, {useEffect, useRef, useState} from 'react';
import {message, Modal, Upload} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {postFile} from "../../utils/requestUtil";
import ipPort from "../../common/ipPort";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function ImageUpload(props) {

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [currentUploadPath, setCurrentUploadPath] = useState('');
    const [fileList, setFileList] = useState([]);
    const fileListNumber = useRef(0);

    const handleCancel = () => {
        setPreviewVisible(false)
    };

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    useEffect(() => {
    }, []);

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
    //真正上传前
    const beforeUpload = async (file, fileList) => {
        console.log('file', file, fileList);
        try {
            let res = await postFile(ipPort + '/admin/upload', {
                file: file,
                articleId:props.articleId,
                isCover:false,//是否为封面（用于删除旧有封面）
            });
            if (res.success) {
                console.log('res.path',res.path)
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
    const beforeRemove = async(file) => {
        console.log('file', file)
        try {
            let res = await postFile(ipPort + '/admin/delete', {
                oldPath:file.path,//删除的图片服务器路径地址
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
                // customRequest={()=>true}
                // action={ipPort+'/admin/upload'}
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
