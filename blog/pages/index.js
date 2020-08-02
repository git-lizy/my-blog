import Head from 'next/head'
import React,{PureComponent,useState,useEffect} from 'react'
import Container from '../components/Container'
import ArticleList from '../components/ArticleList'
import { withRouter } from 'next/router'


// class Home extends PureComponent{
// 	constructor(props){
// 		super(props)
// 		this.state={
// 			asPath:props.router.asPath,
// 			pathCz:true,
// 		}
// 	}
// 	pathChange=async(path)=>{
// 		await this.setState({asPath:path,pathCz:false})
// 		this.setState({pathCz:true})
//
// 	}
// 	render() {
// 		return (
// 			<div className="container">
// 				<Container pathChange={(path)=>{this.pathChange(path)}}>
// 					{this.state.pathCz &&
// 					<ArticleList path={this.state.asPath} />
// 					}
// 				</Container>
// 			</div>
// 		)
// 	}
// }
// export default withRouter(Home)
function Home(props) {
	const [locationList,setLocationList]=useState([])
	const [asPath,setAsPath] = useState(props.router.asPath)
	const [pathCz,setPathCz] = useState(true)
	// console.log('home',props.router.asPath)
	let pathChange=(path)=>{
		setAsPath(path)
	}

	return (
		<div className="container">
			<Container pathChange={(path)=>{pathChange(path)}}>
				{pathCz &&
				<ArticleList key={asPath} path={asPath} />
				}
			</Container>
		</div>
	)
}
export default withRouter(Home)
