import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Content } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView, SafeAreaView, Alert } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Income, ActualIncome } from '../store/Income/types';

// updated by LJC
import {
	GetIncomeAction,
	getIncomeAction,
	SaveIncomeListAction,
	saveIncomeListAction,
	DeleteActualIncomeAction,
	deleteActualIncomeAction
} from '../store/Income/actions';
import { MonthYearSwitcher, MonthYear } from '../components/MonthYearSwitcher';
import { Loader } from '../components/Loader';
import {
	View,	
	Dimensions,
	StyleSheet,	
} from 'react-native';
import IncomeItem from '../components/IncomeItem';
import { HeaderWithAddIcon } from '../components/HeaderWithAddIcon';
import { deleteActualIncome } from '../store/Income/services';

interface Props extends NavigationScreenProps {
	isLoading: boolean;
	username: string;
	password: string;
	IncomeList: Income[];

	// Dispatch props
	getActualIncomeList: (
		username: string,
		password: string,
		month: number,
		year: number,
	) => GetIncomeAction;

	deleteActualIncome: (

		username:string,
		password:string,		
		ActualIncomeID:number
	)=>DeleteActualIncomeAction;

	onAddIncomeItem: (
		username: string,
		password: string,
		month: string,
		year: string,
		incomeItemValue: String,
		selected: number,
	) => SaveIncomeListAction;
}

interface State {
	IncomeList: any[];	
	month: number;
	year: number;
	username: string;
	password: string;
}

export class UnconnectedIncomeEstimate extends Component<Props, State> {
	willFocusSubscription: any = null;
	state = {
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),
		IncomeList: [],		
		username: '',
		password: '',
	};

	componentDidMount() {
		this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => this.changeIncomeList(),
		);	
	}
	componentWillUnmount() {
		this.willFocusSubscription.remove();
	}

	componentWillReceiveProps(props) {		
		
		this.setState({
			IncomeList: props.IncomeList,
			username: props.username,
			password: props.password,
		});
	}

	changeIncomeList() {

		const { username, password } = this.props;
		const { month, year } = this.state;
		this.props.getActualIncomeList(username, password, month, year);
	}

	onChangeMonthYear = ({ month, year }: MonthYear) => {
		this.setState({ month, year }, this.changeIncomeList);
	}	

	onDeleteIncomeItem = (ActualIncomeID:number) => {
		
		const {username, password} = this.props;
		deleteActualIncome (username, password, ActualIncomeID)
		this.setState ({IncomeList:[]},()=>this.changeIncomeList())
	}

	onGoDetail = (income:object) => {
		
		this.props.navigation.navigate ('IncomeDetails',{
			income:income, 
			month: this.state.month,
			year: this.state.year,
			username: this.state.username,
			password: this.state.password,		
		});		
	}
	onUpdateIncomeItem = (income:any) => {

		this.props.navigation.navigate ('AddEditIncomeEstimate',{

			income:income, 
			month: this.state.month,
			year: this.state.year,
			username: this.state.username,
			password: this.state.password,		
		});
	}
	navigateToAddPage = (tabIndex: number) => {
		this.props.navigation.navigate('AddEditIncomeEstimate', {
			month: this.state.month,
			year: this.state.year,
			username: this.state.username,
			password: this.state.password,
			tabIndex:0,
		});
	}
	navigateToAdd = () => {
		
		this.props.navigation.navigate('AddEditIncome', {
			month: this.state.month,
			year:  this.state.year,
			username: this.state.username,
			password: this.state.password,		
		});
	}

	render() {
		return (
			<Container>
				<AppHeader navigation={this.props.navigation} />
				<HeaderWithAddIcon
					navigateToAdd={this.navigateToAdd}
					title="Income"
				/>
								
				<MonthYearSwitcher
					onChangeMonthYear={this.onChangeMonthYear}
					month={this.state.month}
					year={this.state.year}
				/>

				<Content>
					{this.props.isLoading ? (
						<View style={{ alignSelf: 'center' }}>
							<Loader />
						</View>
					) : (
						<View>
							
							<SafeAreaView style={styles.container}>
								<ScrollView style={styles.scrollView}>
									
									{this.state.IncomeList.map((income, index) => (
										<IncomeItem key={index}  											
											
											income={income}
											onGoDetail={this.onGoDetail}
											onUpdateIncomeItem = {this.onUpdateIncomeItem}
											onDeleteIncomeItem = {this.onDeleteIncomeItem}	
										></IncomeItem>
									))}									
									
								</ScrollView>
							</SafeAreaView>
							
						</View>
					)}
				</Content>
			</Container>
		);
	}
}

// updated by LJC
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
	},
	title: {
		flexDirection: 'row',
		margin: 2,
		height: 30,
	},
	input_title: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,

		// borderWidth:1,
		// borderColor:'gray',
	},
	title_toolbar: {
		flex: 4,
		borderColor: 'gray',
	},
	title_source: {
		flex: 7,

		borderColor: 'gray',
		fontWeight: 'bold',
		color: 'black',
		paddingLeft: 2,
	},
	title_frequency: {
		flex: 4,

		borderColor: 'gray',
		color: 'black',
		fontWeight: 'bold',
		paddingLeft: 2,
	},
	title_monthly: {
		flex: 4,
		borderColor: 'gray',
		fontWeight: 'bold',
		color: 'black',
		paddingLeft: 2,
	},
	scrollView: {
		
		// borderWidth:1,
		// borderColor:'gray'
	},
});

// ----------updated by LJC--------------end

const mapStateToProps = ({
	session: { username, password },
	income: { IncomeList, isLoading },
}: any) => ({
	isLoading,
	username,
	password,
	IncomeList,
});

const mapDispatchToProps = (dispatch: any) => ({
	getActualIncomeList: (
		username: string,
		password: string,
		month: number,
		year: number,
	) => dispatch(getIncomeAction({ username, password, month, year })),

	deleteActualIncome: (

		username:string,
		password:string,
		ActualIncomeID:string
	)=>dispatch(deleteActualIncomeAction({ username, password, ActualIncomeID })),

	onAddIncomeItem: (
		username: string,
		password: string,
		month: number,
		year: number,
		incomeItemValue: string,
		selected: number,
	) =>
		dispatch(
			saveIncomeListAction({
				username,
				password,
				month,
				year,
				incomeItemValue,
				selected,
			}),
		),
});

export const IncomeEstimate = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedIncomeEstimate);
