import React,{useState,useEffect,lazy,Suspense} from 'react'
import {Spin} from 'antd'

//异步加载组件
function AsyncComponent(importComponent) {
    function TrueAsyncComponent(props) {
        const [componentObj,setComponentObj] = useState({})
        useEffect(()=>{
            const func = async ()=>{
                const res = await lazy(importComponent)
                return res
            }
            func().then(component=>{
                setComponentObj({component})
            })
        },[])

        const Component = componentObj.component
        return (<>{Component && <Suspense fallback={<Spin spinning style={{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}/>}><Component {...props}/></Suspense>}</>)
    }

    return TrueAsyncComponent
}
export default AsyncComponent
