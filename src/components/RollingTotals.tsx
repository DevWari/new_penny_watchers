import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { View } from 'react-native';

class RollingTotals extends React.Component {
	constructor(props) {
		super(props);
	}	
	static defaultProps = {
		EstimatedIncome: 0,
		EstimatedExpense: 0,
		ActualIncome: 0,
		ActualExpense: 0,
	};
	render() {
	//	const { style } = this.props;

		return (
			<View>
				
				<View
					style={{
						flexDirection: 'row',
						alignSelf:'center'
					}}
				>
					
					<View style={{  }}>
						<Text style={{ textAlign: 'center', color: 'black' }}>Income:</Text>
					</View>					
					<View style={{}}>
						<Text style={{}}> ${this.props.ActualIncome.toFixed(2)}
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: 'row',
						alignSelf:'center'
					}}
				>
					
					<View style={{ }}>
						<Text style={{ textAlign: 'center', color: 'black' }}>
							Expenses:
						</Text>
					</View>					
					<View >
						<Text
							style = {{}}	
						> ${this.props.ActualExpense.toFixed(2)}
						</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',						
						alignSelf:'center'
					}}
				>
					
					<View style={{}}>
						<Text style={{ textAlign: 'center', color: 'black', fontWeight:'bold' }}>
							Remaining:    
						</Text>
					</View>				

						{(this.props.ActualIncome - this.props.ActualExpense) >= 0 ? 

							(<View >
								<Text style={{  color: 'black', fontWeight:'bold'}}> ${(this.props.ActualIncome - this.props.ActualExpense).toFixed(2)}</Text>		
							</View>):(

								<View>
									<Text style={{  color: 'red', fontWeight:'bold'}}> ${(this.props.ActualIncome - this.props.ActualExpense).toFixed(2)}</Text>
								</View>
						 )}				
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	baseText: {
		fontFamily: 'Cochin',
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export default RollingTotals;
