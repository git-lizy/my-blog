import React, {useEffect, useState} from 'react'
import {postFile} from "../../utils/requestUtil"
import ipPort from '../../common/ipPort'
import { message } from "antd";

let editor = null
 
const Editor = (props, ref) => {
    useEffect(() => {
        if (props.first) 
            setConfig(props.initData,props.articleId);  
        return () => {
        }
    },[props.first])
    // 初始化编辑器
    const setConfig = (initData='------\n', articleId) => {
        editor = window.editormd('editor', {
            width: "100%",
            height: "600px",
            markdown: initData,
            path: "/editormd/lib/",
            autoFocus: false
        })
        
        registerMarkerdownEvent(articleId)
    }

    const registerMarkerdownEvent = (id) => {
        let doc = document.getElementById(editor.id);
        doc.addEventListener('paste', (event) => {
            var items = (event.clipboardData || window.clipboardData).items;
            var file = null;
            if (items && items.length) {
                // 搜索剪切板items
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        file = items[i].getAsFile();
                        break;
                    }
                }
            } else {
                console.log("当前浏览器不支持");
                return;
            }
            if (!file) {
                console.log("粘贴内容非图片");
                return;
            }
            id && uploadImg(file, id)
        })
        doc.addEventListener("dragover", (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        doc.addEventListener("dragenter", (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        doc.addEventListener("drop", (e) => {
            e.preventDefault()
            e.stopPropagation()
            var files = this.files || e.dataTransfer.files;
            id && uploadImg(files[0], id);
        })
    }

    const uploadImg = async (file, id) => {
        try {
            let res = await postFile(ipPort + '/admin/upload', {
                file: file,
                articleId: id,
            })
            if (res.success) {
                if(/(png|jpg|jpeg|gif|bmp|ico|image)/.test(res.path)){
                    editor.insertValue("![图片alt]("+ipPort+res.path+")")
                }else{
                    editor.insertValue("[下载附件]("+ipPort+res.path+")")
                }
                return true
            } else {
                message.error(`上传失败,异常信息：${res.code}`);
                return false
            }
        } catch (e) {
            message.error(`上传失败,异常信息：${e}`);
            return false
        }
    }

    return (
      <div id="editor"></div>
    )
}
 
export default Editor