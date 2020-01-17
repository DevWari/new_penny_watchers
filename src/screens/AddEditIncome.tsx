import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Keyboard,View } from 'react-native';
import { connect } from 'react-redux';
import { Content, Form, H1, Picker, Container } from 'native-base';
import { get } from 'lodash';

import { styles } from '../styles';
import { AppHeader } from '../components/AppHeader';
import {

	StyledButton,
	StyledDateInput,
	StyledPicker,
	StyledTextInput,
	StyledSecondaryButton,
} from '../components/StyledInputs';
import { ActualIncome } from '../store/Income/types';
import {
	SaveActualIncomeAction,
	saveActualIncomeAction,
	DeleteActualIncomeAction,
	deleteActualIncomeAction,
} from '../store/Income/actions';
import { Person } from '../store/Expenses/types';
import { MonthYearSwitcher, MonthYear } from '../components/MonthYearSwitcher';
import { formatDollar } from '../utilities/utilities';
import { OpenModalAction, openModalAction } from '../store/Modal/actions';
import { Loader } from '../components/Loader';
import { data } from '../store/Data/reducer';
import {
	getDate,
	getDateYearFirst,
} from '../utilities/utilities';

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
	PersonID: number | null;
	Source: string;
	ActualIncomeAmount: string;
	month: number;
	year: number;
	date: string; 
}

export class UnconnectedAddEditIncome extends Component<Props, State> {
	itemToEdit: ActualIncome = get(
		this.props.navigation,
		'state.params.item',
		null,
	);
	state = {
		PersonID: get(this.itemToEdit, 'PersonID', this.props.people[0].PersonID),
		Source: get(this.itemToEdit, 'Source', ''),
		ActualIncomeAmount: formatDollar(
			get(this.itemToEdit, 'ActualIncomeAmount', 0),
		),
		month: !!this.itemToEdit
			? new Date(this.itemToEdit.ActualIncomeDate).getMonth() + 1
			: this.props.date.getMonth() + 1,
		year: !!this.itemToEdit
			? new Date(this.itemToEdit.ActualIncomeDate).getFullYear()
			: this.props.date.getFullYear(),
		date: !!this.itemToEdit
		? getDate(this.itemToEdit.ActualIncomeDate)
		: getDate(this.props.date),
	};

	componentDidMount () {

	}

	onChangeMonthYear = ({ month, year }: MonthYear) =>
		this.setState({ month, year })
	onChangePerson = (PersonID: number) => this.setState({ PersonID });
	onChangeSource = (Source: string) => this.setState({ Source });
	onChangeAmount = (ActualIncomeAmount: string) =>
		this.setState({ ActualIncomeAmount })

	onSubmitPress = () => {
		const { PersonID, Source, month, year } = this.state;
		const { username, password } = this.props;
		Keyboard.dismiss();
		var ActualIncomeID = 0;
		!!this.itemToEdit ? ActualIncomeID = this.itemToEdit.ActualIncomeID : ActualIncomeID = 0; 		
		this.props.saveIncome({				
			
			ActualIncomeID:ActualIncomeID,
			UserName: username,
			Password: password,
			PersonID,			
			Source,			
			ActualIncomeYear: year,
			ActualIncomeMonth: month,
			ActualIncomeDate: this.state.date,			
		});	
	}

	submitEnabled = () => {
		const { PersonID, Source, ActualIncomeAmount } = this.state;
		return !!PersonID && !!Source && !!ActualIncomeAmount;
	}

	delete = () => {
		const { username, password } = this.props;
		if (!!this.itemToEdit) {
			this.props.openModal(() =>
				// @ts-ignore: Cannot be undefined
				this.props.deleteIncome(
					username,
					password,
					this.itemToEdit.ActualIncomeID,
				),
			);
		}
	}
	onChangeDate = (date: string) => {
		this.setState({ date });		
	} 
	

	render() {
		return (
			<Container>
				<AppHeader
					navigation={this.props.navigation}
					back={true}
					delete={this.itemToEdit && this.delete}
				/>
				<H1 style={styles.header}>
					{!!this.itemToEdit ? 'Edit Income' : 'Add an Income'}
				</H1>
				<Content>

				{this.props.isLoading ? (
						<View style={{ alignSelf: 'center' }}>
							<Loader />
						</View>
					) : (
						<View>
							<Form style={styles.form}>
								{/* <MonthYearSwitcher
									onChangeMonthYear={this.onChangeMonthYear}
									month={this.state.month}
									year={this.state.year}
								/> */}								
								
								{/* <StyledMoneyInput
									placeholder="Income"
									value={this.state.ActualIncomeAmount}
									onChangeText={this.onChangeAmount}
								/> */}
								<StyledDateInput
									date={this.state.date}
									onDateChange={this.onChangeDate}
								/>
								<StyledTextInput
									placeholder="Source"
									value={this.state.Source}
									onChangeText={this.onChangeSource}
								/>
								<StyledPicker
									selectedValue={this.state.PersonID}
									onValueChange={this.onChangePerson}
									placeholder="Person"
									items={this.props.people.map((person) => (
										<Picker.Item
											key={person.PersonName}
											label={person.PersonName}
											value={person.PersonID}
										/>
									))}
								/>
								<StyledButton

									buttonUppercaseAndroidText={false}
									onPress={this.onSubmitPress}
									disabled={!this.submitEnabled()}
									loading={this.props.isLoading}
									text="Save"
								/>
								
								{!!this.itemToEdit ? (

									<View>
									<StyledButton
									onPress={()=>{
										
										this.props.navigation.navigate ('IncomeDetails',{
											income:this.itemToEdit,
											month: this.state.month,
											year:  this.state.year,
											username: this.props.username,
											password: this.props.password
										})
										
									}}
									disabled={!this.submitEnabled()}
									loading={this.props.isLoading}
									text="$ Details"
									/>
									<StyledSecondaryButton onPress={this.delete} text="Delete" />
									</View>
								) : null}
							</Form>
					</View>
				  )}
			
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
	deleteIncome: (username: string, password: string, ActualIncomeID: number) =>
		dispatch(deleteActualIncomeAction({ username, password, ActualIncomeID })),
	openModal: (deleteAction: () => any) =>
		dispatch(
			openModalAction({
				message: 'Are you sure?',
				modalType: 'delete',
				okayAction: deleteAction,
			}),
		),
});

export const AddEditIncome = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedAddEditIncome);
