import React, {useEffect,useImperativeHandle,forwardRef} from 'react'
let editor = null
 
const UEditor = (props,ref) => {
    useEffect(() => {
        console.log(props)
        setConfig(props.initData,props.config,props.setContent)
        return ()=>{
            //editor.destroy();
            // editor.removeListener(); //不要打开，否则返回有问题报错
        }
    },[props.initData,props.config,props.setContent])
    // 初始化编辑器
    const setConfig = (initData,config,setContent) => {
        editor = window.UE &&window.UE.getEditor('editor', {
            // enableAutoSave: false,
            // autoHeightEnabled: false,
            autoFloatEnabled: false,
            initialFrameHeight: (config&&config.initialFrameHeight) || 450,
            initialFrameWidth: (config&&config.initialFrameWidth) || '100%',
            zIndex: 1,
        })
        editor.ready(() => {
            if(initData){
                editor.setContent(initData)  //设置默认值/表单回显
            }
        })
        editor.addListener("blur",function(){
            setContent(editor.getContent())
        });
    }
    useImperativeHandle(ref,()=>({
        getUEContent: ()=> {
            return editor.getContent() //获取编辑器内容
        }
    }))
    return (
      <script id="editor" type="text/plain" />
    )
}
 
export default forwardRef(UEditor)