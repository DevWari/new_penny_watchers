import React, { Component } from 'react';
import { Container, Content, H1} from 'native-base';

import { View} from 'react-native';
import { connect } from 'react-redux';
import { NavigationScreenProps } from 'react-navigation';

import { AppHeader } from '../components/AppHeader';
import { Loader } from '../components/Loader';
import { GetReportAction, getReportAction } from '../store/Report/actions';
import {
	
	StyledButton,	
} from '../components/StyledInputs';

interface Props extends NavigationScreenProps {
	report: any;
	isLoading: boolean;
	username: string;
	password: string;

	getReport: (
		username: string,
		password: string,
		month: number,
		year: number,
	) => GetReportAction;
}

interface State {
	month: number;
	year: number;
	// title: string;
	
}

class UnconnectedReport extends Component<Props, State> {
	willFocusSubscription: any = null;
	state = {
		month: new Date().getMonth() + 1,
		year: new Date().getFullYear(),	
		// title: 'Report Menu'
	};		

	render() {
		return (
			<Container>
				<AppHeader navigation={this.props.navigation} 
					back={true}

				/>
				<View style={{ flex: 0.1, flexDirection: 'row' }}>
					<H1 style={{ flex: 3, marginTop: 10, textAlign: 'center' }}>
						{/* {this.state.title} */}
						Report Menu
					</H1>					
				</View>				
				<Content>
					{this.props.isLoading ? (
						<View style={{ alignSelf: 'center' }}>
							<Loader />
						</View>
					) : (
						// this.renderReport()
						<View>
							
						<StyledButton
							// onPress={()=>this.setState({title:'Expense Report Menu'})}
							onPress={()=>this.props.navigation.navigate('OldReport')}
							disabled={false}
							// loading={this.props.isLoading}
							text ="Expense Report"
							style={{backgroundColor:'#BBB'}}
						/>
						<StyledButton
							onPress={()=>{this.props.navigation.navigate('MonthlyReport')}}
							disabled={false}
							// loading={this.props.isLoading}
							text="Income/Expense Report"
						/>

						</View>
					)}
				</Content>
			</Container>
		);
	}
}

const mapStateToProps = ({
	report: { report, isLoading },
	session: { username, password },
}: any) => ({
	report,
	isLoading,
	username,
	password,
});

const mapDispatchToProps = (dispatch: any) => ({
	getReport: (
		username: string,
		password: string,
		month: number,
		year: number,
	) => dispatch(getReportAction({ username, password, month, year })),
});

export const Report = connect(
	mapStateToProps,
	mapDispatchToProps,
)(UnconnectedReport);
