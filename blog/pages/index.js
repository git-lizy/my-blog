import Head from 'next/head'
import React,{PureComponent,useState,useCallback} from 'react'
import Container from '../components/Container'
import ArticleList from '../components/ArticleList'
import { withRouter } from 'next/router'


function Home(props) {

	return (
		<div className="container">
			<Container  >
				<ArticleList  key={props.router.asPath+'1'} path={props.router.asPath}/>

			</Container>
		</div>
	)
}
export default withRouter(Home)
