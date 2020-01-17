import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Content, Form, H1, Container,Button,Picker  } from 'native-base';
import { NavigationScreenProps } from 'react-navigation';

import { styles } from '../styles';
import {
	
	SaveBudgetItemAction,
	saveBudgetItemAction,
} from '../store/Expenses/actions';
import { Category} from '../store/Expenses/types';
import { AppHeader } from '../components/AppHeader';
import {
	StyledTextInput,
	StyledButton,	
	StyledPicker,
} from '../components/StyledInputs';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { baseURL } from '../config';
import { urlHeaders } from '../constants';



interface Props extends NavigationScreenProps {
	isLoading: boolean;	
	username: string;
	password: string;
	date: Date;
	
	saveBudgetItems: (
		username: string,
		password: string,
		month: string,
		year: string,
		budgetItems: Category[],
	) => SaveBudgetItemAction;

}

interface State {
	month: number;
	year: number;	
	toggle:boolean;
	income:object | null;		
	username:string;
	password:string;

	itemType: string;
	itemAmount:string;
	ActualIncomeItemTypeID:number;	
	ActualIncomeItemID:number;
	incomeItemTypeList: string[];
	selectedType: string;
	standardValue:string;

	existing_button_flag:boolean,
	new_button_flag:boolean,
	
	add_edit_flag:boolean;
	page_title: string;

	incomeObj: Object | null;
}

export class UnconnectedAddEditIncomeItem extends Component<Props, State> {

	state = {

		toggle:this.props.navigation.state.params.default_screen,
		month: this.props.navigation.state.params.month,
		year: this.props.navigation.state.params.year,
		income:this.props.navigation.state.params.income,
		username: this.props.navigation.state.params.username,
		password: this.props.navigation.state.params.password,
		ActualIncomeItemTypeID:this.props.navigation.state.params.ActualIncomeItemTypeID,		
		ActualIncomeItemID: 0,
		add_edit_flag: this.props.navigation.state.params.add_edit_flag,
		page_title:'Add an Income Item',
		
		itemType:'',
		itemAmount:'',
		incomeItemTypeList:[],

		selectedType:'',
		standardValue:'',

		existing_button_flag:true,
		new_button_flag:true,
		incomeObj: this.props.navigation.state.params.incomeObj,
	}

	togglePicker = () => {

		this.setState ({toggle: !this.state.toggle});
	}

	onSave = () => {

		const username = this.props.username;
		const password = this.props.password;
		const month = this.state.month;
		const year = this.state.year;
		const url =
			baseURL +
			`/ActualIncome/SaveActualIncomeItem?username=${username}&password=${password}&ActualIncomeMonth=${month}&ActualIncomeYear=${year}`;

			const body = JSON.stringify({		
				
				ActualIncomeItemID:this.state.ActualIncomeItemID,
				ActualIncomeID:this.state.income.ActualIncomeID,
				ActualIncomeItemTypeID:this.state.ActualIncomeItemTypeID,
				ActualIncomeItemTypeDescription: '',
				ActualIncomeItemDescription:this.state.itemType,
				ActualIncomeItemAmount:this.state.itemAmount
			});			
			
		 	fetch(url, { method: 'POST', body, headers: urlHeaders }).then(res => res.json())
			.then(json => {				
			
				this.props.navigation.goBack()
			 });		
	}

	onSaveStandard = () => {

		const username = this.props.username;
		const password = this.props.password;
		const month = this.state.month;
		const year = this.state.year;
		const url =
			baseURL +
			`/ActualIncome/SaveActualIncomeItem?username=${username}&password=${password}&ActualIncomeMonth=${month}&ActualIncomeYear=${year}`;

			const body = JSON.stringify({		
				
				ActualIncomeItemID:this.state.ActualIncomeItemID,
				ActualIncomeID:this.state.income.ActualIncomeID,
				ActualIncomeItemTypeID:this.state.ActualIncomeItemTypeID,
				ActualIncomeItemTypeDescription: '',
				ActualIncomeItemDescription:this.state.selectedType,
				ActualIncomeItemAmount:this.state.standardValue
			});			
			
		 	fetch(url, { method: 'POST', body, headers: urlHeaders }).then(res => res.json())
			.then(json => {			
				
				this.props.navigation.goBack()
			 });		
	}

	getIncomeItemTypeList = (ActualIncomeItemTypeID:number) => {

		const username = this.props.username;
		const password = this.props.password;		
		const url =
			baseURL +
			`/ActualIncome/GetStandardIncomeItemList?username=${username}&password=${password}&ActualIncomeItemTypeID=${ActualIncomeItemTypeID}`;
		
		fetch(url).then(res => res.json())
		.then (json=>{
			
			this.setState ({incomeItemTypeList: json.ActualIncomeDetailItemList})
		})
	}

	componentDidMount () {
		
		this.getIncomeItemTypeList(this.props.navigation.state.params.ActualIncomeItemTypeID)

		if (this.state.add_edit_flag == true && this.state.ActualIncomeItemTypeID == 1) this.setState ({page_title: 'Add an Income Item'})
		else if (this.state.add_edit_flag == false && this.state.ActualIncomeItemTypeID == 1) this.setState ({page_title: 'Edit an Income Item'})
		else if (this.state.add_edit_flag == true && this.state.ActualIncomeItemTypeID == 2) this.setState ({page_title: 'Add a Deduction Item'})
		else this.setState ({page_title: 'Edit a Deduction Item'})
	
		if ( this.state.add_edit_flag == false ) {

			this.setState({

				ActualIncomeItemID:this.props.navigation.state.params.incomeObj.ActualIncomeItemID,
				ActualIncomeID:this.props.navigation.state.params.incomeObj.ActualIncomeID,
				ActualIncomeItemTypeID:this.props.navigation.state.params.incomeObj.ActualIncomeItemTypeID,				
				itemType: this.props.navigation.state.params.incomeObj.ActualIncomeItemDescription,	
				itemAmount:this.props.navigation.state.params.incomeObj.ActualIncomeItemAmount.toString(),
				standardValue:this.props.navigation.state.params.incomeObj.ActualIncomeItemAmount.toString(),
			})
		}
	}

	render() {
		return (
			<Container>
				<AppHeader navigation={this.props.navigation} back={true} />
						<H1 style={styles.header}>{this.state.page_title}</H1>

						<Content>							

							<View style={{ flexDirection: 'row', justifyContent: 'center' }}>

								<Button
									style={styledStyles.leftComboButton}
									primary										
									bordered={this.state.toggle}
									onPress={this.togglePicker}
								>
									<Text style={styledStyles.buttonFont}>Existing</Text>
								</Button>
								<Button
									style={styledStyles.rightComboButton}
									primary							
									
									bordered={!this.state.toggle}
									onPress={this.togglePicker}
								>
									<Text style={styledStyles.buttonFont}>New</Text>
								</Button>
							 </View>

							 {this.state.toggle ? (
									
								<View>
									<Form style={{

										width: '100%',
										paddingHorizontal: 30,
										paddingBottom: 10,
										marginTop:50,
									}} >
										
										<StyledTextInput
											placeholder="Type"
											value={this.state.itemType}
											onChangeText={(text) => this.setState({itemType:text, new_button_flag:false })}
											style ={{height:40,padding:2}}
										/>
										<StyledTextInput
											placeholder="Amount"
											keyboardType="numeric"
											style ={{height:35,padding:2}}
											value={this.state.itemAmount}
											onChangeText={(text) => this.setState({itemAmount:text, new_button_flag:false })}
										/>
																		
								    </Form>
								 	<StyledButton
									 onPress={this.onSave}
									 disabled={this.state.new_button_flag}
									 loading={this.props.isLoading}
									 text="Save"
									 
									 />
								</View>		
							) : (
								
								<View>
									<Form style={{

										width: '100%',
										paddingHorizontal: 30,
										paddingBottom: 10,
										marginTop:50,
									}} >	
									

									<StyledPicker
										selectedValue={this.state.selectedType}
										onValueChange={(value)=>this.setState({selectedType:value})}
										placeholder="Type"
										items={this.state.incomeItemTypeList.map((item,index) => (
											<Picker.Item
												key={index}
												label={item.ActualIncomeItemTypeDescription}
												value={item.ActualIncomeItemTypeDescription}
											/>
										))}
									/>
										<StyledTextInput
											placeholder="Amount"
											keyboardType="numeric"
											style ={{height:35,padding:2}}
											value={this.state.standardValue}
											onChangeText={(text) => this.setState({standardValue:text,existing_button_flag:false })}
										/>
																		
								    </Form>
								 	<StyledButton
										onPress={this.onSaveStandard}
										disabled={this.state.existing_button_flag}
										//loading={this.props.isLoading}
										text="Save"									 
									 />
									 </View>
								
						   )}					
					</Content>
		
			</Container>
		);
	}
}

const styledStyles = StyleSheet.create({

	leftComboButton: {
		minWidth: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},
	rightComboButton: {
		minWidth: 100,
		justifyContent: 'center',
		alignItems: 'center',
		borderTopLeftRadius: 0,
		borderBottomLeftRadius: 0,
	},
	buttonFont: {
		fontSize: 16,
	},
});

const mapStateToProps = ({
	
	session: { username, password },
	
}: any) => ({
	
	username : username,
	password : password,
	
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
			saveBudgetItemAction({
				username,
				password,
				month,
				year,
				budgetItems,
				isCategory: true,
			}),
		),
	// saveActualIncomeItems: (
	// 	username: string,
	// 	password: string,
	// 	ActualIncomeID:number,
	// 	ActualIncomeItemTypeID:number,
	// ) => dispatch (

	// 	saveActualIncomeItemAction ({

	// 		username,
	// 		password,
	// 		ActualIncomeID,
	// 		ActualIncomeItemTypeID
	// 	}),
	// )	
});

export const AddEditIncomeItem = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedAddEditIncomeItem);
