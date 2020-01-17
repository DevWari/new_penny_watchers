import React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

export default class ExpenseReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            Expense: props.Expense,
            SourceKeys: [],
        };
    }
    componentWillMount() {

        let group = this.props.Expense.reduce((r, a) => {

            r[a.Category] = [...r[a.Source] || [], a];
            return r;
        }, {});

        this.setState({ SourceKeys: Object.keys(group),Expense:this.props.Expense})        
    }

    onTotalExpenseSubItem = (Category:string) => {

        const list = this.props.Expense.filter((obj) => obj.Category == Category)
        let sum:number = 0.0;

        list.map ((item:object, index:number)=>{

            sum += Math.abs(item.ExpenseAmount)
        })
        return sum
    }   

    onTotalExpense = () => {              
        
        let sum:number = 0.0;

        this.props.Expense.map ((item:object, index:number)=>{

            sum += Math.abs(parseFloat(item.ExpenseAmount))            
        })
        return parseFloat(sum)
    }

    render() {        

        return (

            <View>
                
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>Expenses</Text>
                <View style={{ marginLeft: 15 }}>
                    {this.state.SourceKeys.map((item: string, index: number) =>
                        <View key={item + index}>
                            <Text style={{fontWeight:'bold', fontSize:17, color:'black'}} >{item}</Text>
                            <View style={{ marginLeft: 15 }}>                                
                                
                                    {
                                        this.props.Expense.filter((obj) => obj.Category == item).map((item: object, index: number) => 
                                            <View style={{marginLeft:15}}>
                                               <View style={{flexDirection:'row'}}> 
                                                    <Text style={{flex:2}} key={'item' + index}>{item.SubCategory}</Text>
                                                    <Text style={styledStyles.amount} key={'amount' + index}>${Math.abs(item.ExpenseAmount.toFixed(2))}</Text>
                                               </View>
                                            </View>
                                    )}                                                               
                             </View>
                             <View style={{flexDirection:'row'}}> 
                                     <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}} key={'item' + index}>{item} Totals</Text>
                                     <Text style={[styledStyles.item_total,{borderTopWidth:1, borderColor:'grey'}]} key={'total' + index}>${this.onTotalExpenseSubItem(item).toFixed(2)}</Text>
                             </View>                             
                         </View>
                     )}
                 </View>
                <View style={{flexDirection:'row'}}> 
                   <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}}>Expense Totals</Text>
                   <Text numberOfLines={1} style={[styledStyles.parent_income_total,{borderTopWidth:1, borderColor:'grey'}]}>${this.onTotalExpense().toFixed(2)}</Text>
                </View>
             </View>
        )
    }
}

const styledStyles = StyleSheet.create({

    container: {
        flex: 1,
    },
    amount: {

        flex:1,
        marginLeft:20,
        textAlign:'right',
        paddingRight:25
    },
    item_total: {

        flex:1,
        marginLeft:20,
        fontWeight:'bold',
        fontSize:17,
        color:'black',
        paddingLeft:15,
        textAlign:'right',
        paddingRight:25
    },
    parent_item_total: {

        flex:2,
        marginLeft:20,
        fontWeight:'bold',
        fontSize:17,
        color:'black',
        paddingLeft:30,
        textAlign:'right',
        paddingRight:25
    },
    parent_income_total: {

        flex:1,
        marginLeft:20,
        fontWeight:'bold',
        fontSize:17,
        color:'black',
        paddingLeft:30,
        textAlign:'right',
        paddingRight:25
    }
});