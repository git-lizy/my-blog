import React,{useState,useEffect,lazy,Suspense} from 'react'

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
        return (<>{Component && <Suspense fallback={<span style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>loading</span>}><Component {...props}/></Suspense>}</>)
    }

    return TrueAsyncComponent
}
export default AsyncComponent
