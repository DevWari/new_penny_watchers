import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, ScrollView, SafeAreaView, View } from 'react-native';
import { connect } from 'react-redux';
import { Content, H1, Picker, Container } from 'native-base';
import { styles } from '../styles';
import { AppHeader } from '../components/AppHeader';

import { ActualIncome } from '../store/Income/types';
import {
	SaveActualIncomeAction,
	saveActualIncomeAction,
	DeleteActualIncomeAction,

} from '../store/Income/actions';
import { Person } from '../store/Expenses/types';
import { MonthYearSwitcher, MonthYear } from '../components/MonthYearSwitcher';
import { OpenModalAction } from '../store/Modal/actions';
import { baseURL } from '../config';
import { Loader } from '../components/Loader';
import {

	StyledPicker,
} from '../components/StyledInputs';
import IncomeReport from '../components/report/IncomeReport'
import ExpenseReport from '../components/report/ExpenseReport'

interface Props extends NavigationScreenProps {
	isLoading: boolean;
	people: Person[];
	username: string;
	password: string;
	date: Date;

	// Dispatch props
	saveIncome: (saveActualIncomeRequest: ActualIncome) => SaveActualIncomeAction;
	deleteIncome: (
		username: string,
		password: string,
		ActualIncomeID: number,
	) => DeleteActualIncomeAction;
	openModal: (deleteAction: () => any) => OpenModalAction;
}

interface State {

	month: number;
	year: number;
	ExpenseItemList: any[];
	ActualIncomeItemList: any[];
	isLoading: boolean;
	PersonID: number | null;
	Persons: any[];
}

interface People {

	PersonID: number;
	PersonName: string;
	UserID: number;
	ErrorCode: number;
	ErrorMessage: string | null;
}

export class UnconnectedMonthlyReport extends Component<Props, State> {

	state = {

		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		ExpenseItemList: [],
		ActualIncomeItemList: [],
		isLoading: false,
		PersonID: 0,
		Persons: [],
	};

	onChangeMonthYear = ({ month, year }: MonthYear) => {

		this.setState({ month, year, isLoading:false },()=>this.getExpenseReportList(this.state.PersonID))		
	}

	getExpenseReportList = (PersonID:number) => {

		const username = this.props.username;
		const password = this.props.password;
		const { month, year } = this.state;
		const url =
			baseURL +
			`/Reports/GetIncomeExpenseReport?username=${username}&password=${password}&month=${month}&year=${year}&PersonID=${PersonID}`;

		fetch(url).then(res => res.json())
			.then(json => {
				
				var all_people: People = {
					PersonID: 0,
					PersonName: "All",
					UserID: 0,
					ErrorCode: 0,
					ErrorMessage: null
				}
				let newArray: Array<People> = [];
				newArray.push(all_people);
				const arr3 = [...newArray, ...this.props.people]				
				this.setState({
					ActualIncomeItemList: json.ActualIncomeItemList,
					ExpenseItemList: json.ExpenseItemList, Persons: arr3,
					isLoading: true,
				})
			})
	}

	componentDidMount() {

		this.getExpenseReportList(0)
	}


	onChangePerson = (PersonID: number) => {
		this.setState({ PersonID: PersonID, ExpenseItemList: [],
			ActualIncomeItemList: []}, ()=>this.getExpenseReportList(PersonID))		
	}

	onGrandTotal =() => {

		const income_list = this.state.ActualIncomeItemList.filter ((obj)=>obj.Type == 'Income')
		const deduction_list = this.state.ActualIncomeItemList.filter ((obj)=>  obj.Type == 'Deduction')
		let sum : number = 0
		income_list.map ((item, index) => {
			sum += item.ActualIncomeAmount
		})
		deduction_list.map ((item, index) => {
			sum -= Math.abs(item.ActualIncomeAmount)
		})
		sum = Math.abs(sum)
		this.state.ExpenseItemList.map ((item,index) => {
			sum -= Math.abs(item.ExpenseAmount)
		})
		return sum
	}

	render() {
		return (
			<Container>
				<AppHeader
					navigation={this.props.navigation}
					back={true}

				/>
				<H1 style={styles.header}>
					Income/Expense Report
				</H1>
				<MonthYearSwitcher
					onChangeMonthYear={this.onChangeMonthYear}
					month={this.state.month}
					year={this.state.year}
				/>
				<View style={{ flexDirection: 'row' }} >
					<View style={{flex:1}}> 

						<Text style={{color:'black', fontSize:17,paddingTop:15, paddingLeft:10}}>Expenses For Person:</Text>
					</View>
					<View style={{flex:1, marginRight:'5%'}}>
						<StyledPicker
							selectedValue={this.state.PersonID}
							onValueChange={this.onChangePerson}
							placeholder="Person"
							style={{width:'10%'}}
							items={
								this.state.Persons.map((person) => (
									<Picker.Item
										key={person.PersonName}
										label={person.PersonName}
										value={person.PersonID}
									/>
							 ))}
						/>
					</View>
				 </View>
				<Content>
					<SafeAreaView>
						<ScrollView>
							{this.state.isLoading == false ? (

								<View style={{ alignSelf: 'center' }}>
									<Loader />
								</View>
							) : (									

									<View style={{ marginLeft: 20 }}>										
										{this.state.ActualIncomeItemList !== undefined ? (								
											<IncomeReport
												Income={this.state.ActualIncomeItemList}
											></IncomeReport>
										):(

											<View></View>
										)}

									    {this.state.ExpenseItemList !== undefined ? (
											<View>	
												<ExpenseReport
													Expense={this.state.ExpenseItemList}
												></ExpenseReport>
												<View style={{flexDirection:'row'}}> 
													<Text style={{flex:2, paddingLeft:40, fontWeight:'bold', fontSize:17, color:'black'}}>Grand Total</Text>
													<Text style={{flex:1,textAlign:'right',paddingRight:25,borderTopWidth:1, borderColor:'grey', fontWeight:'bold', fontSize:17, color:'black'}} numberOfLines={1}>${this.onGrandTotal().toFixed(2)}</Text>
												</View>
												<View style={{height:50}}></View> 
											</View>
										):(

											<View></View>
										)}
									 </View>
							)}																	
								
						</ScrollView>
					</SafeAreaView>
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = ({
	config: { people, isLoading },
	session: { username, password },
	data: { date },
}: any) => ({
	people,
	isLoading,
	username,
	password,
	date,
});

const mapDispatchToProps = (dispatch: any) => ({
	saveIncome: (saveActualIncomeRequest: ActualIncome) =>
		dispatch(saveActualIncomeAction(saveActualIncomeRequest)),
});

export const MonthlyReport = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedMonthlyReport);
