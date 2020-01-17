import React, { Component } from 'react';
import {
	Container,
	Content,	
	Text,	
	Icon,
	H1,
} from 'native-base';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';
import { isEqual } from 'lodash';
import { AppHeader } from '../components/AppHeader';
import {

	saveBudgetItemAction,
	SaveBudgetItemAction,
	DeleteBudgetItemAction,
	deleteBudgetItemAction,
} from '../store/Expenses/actions';
import { Category } from '../store/Expenses/types';
import { colors } from '../constants';
import { Loader } from '../components/Loader';
import { MonthYearSwitcher,MonthYear} from '../components/MonthYearSwitcher';
import { OpenModalAction, openModalAction } from '../store/Modal/actions';

import { baseURL } from '../config';
import IncomeItemList from '../components/IncomeItemList';


interface Props extends NavigationScreenProps {
	categories: Category[];
	isLoading: boolean;
	username: string;
	password: string;	

	saveBudgetItems: (
		username: string,
		password: string,
		month: string,
		year: string,
		budgetItems: Category[],
	) => SaveBudgetItemAction;
	deleteBudgetItem: (
		username: string,
		password: string,
		BudgetID: number,
		successAction: () => void,
	) => DeleteBudgetItemAction;

	openModal: (deleteAction: () => any) => OpenModalAction;
}

interface State {
	
	income:object | null;
	year:number;
	month:number;
	username:string;
	password:string;

	incomeItemList:object[];
	deductionItemList:object[];

	income_deduction: boolean;
}

class UnconnectedIncomeDetail extends Component<Props, State> {
	willFocusSubscription: any = null;

	state = {
		
		income:this.props.navigation.state.params.income,
		year:this.props.navigation.state.params.year,
		month:this.props.navigation.state.params.month,
		username:this.props.navigation.state.params.username,
		password:this.props.navigation.state.params.password,
		incomeItemList:[],
		deductionItemList:[],
		income_deduction:true,
	};

	getIncomeItemList = () => {

		const username = this.props.username;
		const password = this.props.password;		
		const url =
			baseURL +
			`/ActualIncome/GetActualIncomeItemList?username=${username}&password=${password}&ActualIncomeItemTypeID=${1}` +
			`&ActualIncomeID=${this.state.income.ActualIncomeID}`

		
		fetch(url).then(res => res.json())
		.then (json=>{					
			
			this.setState({incomeItemList:json.ActualIncomeDetailItemList})
		})
	}
	getDeductionItemList = () => {

		const username = this.props.username;
		const password = this.props.password;		
		const url =
			baseURL +
			`/ActualIncome/GetActualIncomeItemList?username=${username}&password=${password}&ActualIncomeItemTypeID=${2}` +
			`&ActualIncomeID=${this.state.income.ActualIncomeID}`

		
		fetch(url).then(res => res.json())
		.then (json=>{			
			
			this.setState({deductionItemList:json.ActualIncomeDetailItemList})
		})
	}
	componentDidMount() {
		
		this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {

				if (this.state.income_deduction == true) 

					this.setState({incomeItemList:[]}, ()=>this.getIncomeItemList())
				else this.setState({deductionItemList:[]}, ()=>this.getDeductionItemList())				
			}
		);		
		this.getIncomeItemList();
		this.getDeductionItemList();		
	}

	componentWillUnmount() {

		this.willFocusSubscription.remove();		
	}

	onUpdateIncomeItem = (income: object) => {

		if (income.ActualIncomeItemTypeID == 1) this.setState ({income_deduction:true})
		else this.setState ({income_deduction:false})		
		
		this.props.navigation.navigate('AddEditIncomeItem', {

			income:this.state.income,
			year:this.state.year,
			month:this.state.month,
			username:this.state.username,
			password:this.state.password,
			ActualIncomeItemTypeID:income.ActualIncomeItemTypeID,
			default_screen: true,
			add_edit_flag: false,
			incomeObj: income,
		})		
	}
	onDeleteIncomeItem = (ActualIncomeItemID:number, ActualIncomeItemType:number) => {

		const username = this.props.username;
		const password = this.props.password;
		const month = this.state.month;
		const year = this.state.year;
		const url =
			baseURL +
			`/ActualIncome/DeleteActualIncomeItem?username=${username}&password=${password}&ActualIncomeMonth=${month}` +
			`&ActualIncomeYear=${year}&ActualIncomeItemID=${ActualIncomeItemID}`;
			
		 	fetch(url).then(res => res.json())
			.then(json => {	

				if (ActualIncomeItemType == 1) this.setState ({incomeItemList:[]}, ()=> this.getIncomeItemList())
				else this.setState ({deductionItemList:[]}, ()=> this.getDeductionItemList())
			 });			 
	}

	render() {
		return (
			<Container>
				<AppHeader navigation={this.props.navigation} 
					back={true}	
					detail ={1}		
				/>
				
				<View
					style={{
						flexDirection: 'row',
						marginTop: 10,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<H1>Income Details</H1>			
				</View>
				
				<Content>
					{this.props.isLoading ? (
						<View style={{ alignSelf: 'center' }}>
							<Loader />
						</View>
					) : (
						<View>

							<SafeAreaView>
								<ScrollView>

									<View
										style={{
												 flexDirection: 'row',
												 marginTop: 30,											
												}}>
										<Text style={{fontSize:20, color:'black', fontWeight:'bold', paddingLeft:15,}}>Income Items:</Text>
										<TouchableOpacity								
										onPress={()=>{
											
											this.setState ({income_deduction: true})
											this.props.navigation.navigate('AddEditIncomeItem', {
												income:this.state.income,
												year:this.state.year,
												month:this.state.month,
												username:this.state.username,
												password:this.state.password,
												ActualIncomeItemTypeID:1,
												default_screen: false,
												add_edit_flag: true,
										})}								
										}
										>
											<Icon
												type="SimpleLineIcons"
												name="plus"
												style={{ color: 'orange', marginLeft: 10 }}
											/>
										</TouchableOpacity>  
									</View>
										
									<View style={{marginLeft:10, marginTop: 10}}>
										
										{this.state.incomeItemList.map((income, index) => (

											<IncomeItemList key={index}  											
													
												income={income}											
												onUpdateIncomeItem = {this.onUpdateIncomeItem}
												onDeleteIncomeItem = {this.onDeleteIncomeItem}									
											></IncomeItemList>
										))}	

									</View>
									<View
										style={{
													flexDirection: 'row',
													marginTop: 10,											
													}}>
										<Text style={{fontSize:20, color:'black', fontWeight:'bold', paddingLeft:15,}}>Deduction Items:</Text>
										<TouchableOpacity
											onPress={()=> {
												
															this.setState ({income_deduction:false})
															this.props.navigation.navigate('AddEditIncomeItem', {

																income:this.state.income,
																year:this.state.year,
																month:this.state.month,
																username:this.state.username,
																password:this.state.password,
																ActualIncomeItemTypeID:2,												
																default_screen: false,
																add_edit_flag: true,
											})}}
										>
											<Icon
												type="SimpleLineIcons"
												name="plus"
												style={{ color: 'orange', marginLeft: 10 }}
											/>
										</TouchableOpacity>  
									</View>
									<View style={{marginLeft:10, marginTop: 10}}>
										
										{this.state.deductionItemList.map((income, index) => (

											<IncomeItemList key={index}  											
													
												income={income}											
												onUpdateIncomeItem = {this.onUpdateIncomeItem}
												onDeleteIncomeItem = {this.onDeleteIncomeItem}									
											></IncomeItemList>
										))}	

									</View>
								</ScrollView >
							</SafeAreaView >							
						</View>
					)}
				</Content>				
			</Container>
		);
	}
}

const mapStateToProps = ({
	config: { categories, isLoading },
	session: { username, password },
}: any) => ({
	categories,
	isLoading,
	username,
	password,
});

const mapDispatchToProps = (dispatch: any) => ({
	
	saveBudgetItems: (
		username: string,
		password: string,
		month: string,
		year: string,
		budgetItems: Category[],
	) =>
		dispatch(
			saveBudgetItemAction({ username, password, month, year, budgetItems }),
		),
	deleteBudgetItem: (
		username: string,
		password: string,
		BudgetID: number,
		successAction: () => void,
	) =>
		dispatch(
			deleteBudgetItemAction({ username, password, BudgetID, successAction }),
		),
	openModal: (deleteAction: () => any) =>
		dispatch(
			openModalAction({
				message: 'Are you sure?',
				modalType: 'delete',
				okayAction: deleteAction,
			}),
		),
});

export const IncomeDetails = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedIncomeDetail);

