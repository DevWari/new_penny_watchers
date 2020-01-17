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
}

interface State {
	PersonID: number | null;
	Source: string;	
	month: number;
	year: number;
	date: string; 
	income:object | null;
}

export class UnconnectedAddEditIncomeEstimate extends Component<Props, State> {
	
	income: object = get(
		this.props.navigation,
		'state.params.income',
		null,
	);
	year: number = get(
		this.props.navigation,
		'state.params.year',
		null,
	);
	month: number = get(
		this.props.navigation,
		'state.params.month',
		null,
	);
	username: number = get(
		this.props.navigation,
		'state.params.username',
		null,
	);
	password: number = get(
		this.props.navigation,
		'state.params.password',
		null,
	);	
	
	state = {
		PersonID: get(this.income, 'PersonID', this.props.people[0].PersonID),
		Source: get(this.income, 'Source', ''),		
		month: !!this.month
			? new Date(this.income.ActualIncomeDate).getMonth() + 1
			: this.props.date.getMonth() + 1,
		year: !!this.year
			? new Date(this.income.ActualIncomeDate).getFullYear()
			: this.props.date.getFullYear(),
		date: !!this.income
		? getDate(this.income.ActualIncomeDate)
		: getDate(this.props.date),
		income: this.income	
	};
	
	onChangeMonthYear = ({ month, year }: MonthYear) =>
		this.setState({ month, year })
	onChangePerson = (PersonID: number) => this.setState({ PersonID });
	onChangeSource = (Source: string) => this.setState({ Source });	

	onSubmitPress = () => {		
		
		const { PersonID, Source, month, year,income } = this.state;
		const { username, password } = this.props;
		Keyboard.dismiss();	

		this.props.saveIncome({	

			ActualIncomeID:income.ActualIncomeID,
			UserName: username,
			Password: password,
			PersonID,			
			Source,
			ActualIncomeYear: year,
			ActualIncomeMonth: month,
			ActualIncomeDate: this.state.date,		
		});	
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
					Edit Income
				</H1>
				<Content>

				{this.props.isLoading ? (
						<View style={{ alignSelf: 'center' }}>
							<Loader />
						</View>
					) : (
						<View>
							<Form style={styles.form}>
								<MonthYearSwitcher
									onChangeMonthYear={this.onChangeMonthYear}
									month={this.state.month}
									year={this.state.year}
								/>
								
								
								<StyledDateInput
									date={this.state.date}
									onDateChange={this.onChangeDate}
								/>
								<StyledTextInput
									placeholder="Source"
									value={this.state.Source}
									onChangeText={(text)=>this.onChangeSource(text)}
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
									onPress={this.onSubmitPress}
									disabled={false}
									loading={this.props.isLoading}
									text="Save"
								/>								
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
	
});

export const AddEditIncomeEstimate = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedAddEditIncomeEstimate);
