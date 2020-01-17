import React from 'react';
import { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'


export default class IncomeReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            Income: props.Income,
            SourceKeys: [],
        };
    }
    componentWillMount() {
        
        if (this.props.Income.length > 0 ) {
            let group = this.props.Income.reduce((r, a) => {

                r[a.Source] = [...r[a.Source] || [], a];
                return r;
            }, {});

            this.setState({ SourceKeys: Object.keys(group) })
        }       
    }    

    onTotalIncomeItem = (Source:string, Type:string) => {

        const list = this.props.Income.filter((obj) => obj.Source == Source && obj.Type == Type)
        let sum:number = 0;

        list.map ((item:object, index:number)=>{

            sum += item.ActualIncomeAmount
        })
        return sum
    }
    onTotalAllItems = (Source:string) => {

        let income_sum    = this.onTotalIncomeItem (Source,'Income')
        let deduction_sum = this.onTotalIncomeItem (Source,'Deduction')
        return Math.abs(income_sum-deduction_sum)        
    }

    onTotalIncome = () => {        
       
        const income_list    = this.props.Income.filter((obj) =>obj.Type == 'Income')
        const deduction_list = this.props.Income.filter((obj) =>obj.Type == 'Deduction')
        let income_sum:number    = 0
        let deduction_sum:number = 0

        income_list.map ((item:object, index:number)=>{
            income_sum += item.ActualIncomeAmount
        })
        deduction_list.map ((item:object, index:number)=>{
            deduction_sum += item.ActualIncomeAmount
        })

        return Math.abs(income_sum-deduction_sum).toFixed(2)
    }

    render() {        

        return (
            
            <View>
                <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>Income</Text>
                <View style={{ marginLeft: 15 }}>
                    {this.state.SourceKeys.map((item: string, index: number) =>
                        <View key={item + index}>
                            <Text style={{fontWeight:'bold', fontSize:17, color:'black'}} >{item}</Text>
                            <View style={{ marginLeft: 15 }}>
                                
                                <Text style={{fontWeight:'bold', fontSize:17, color:'black'}}>Income Items</Text>
                                    {
                                        this.props.Income.filter((obj) => obj.Source == item && obj.Type == 'Income').map((item: object, index: number) => 
                                            <View style={{marginLeft:15}}>
                                               <View style={{flexDirection:'row'}}> 
                                                    <Text style={{flex:2}} key={'item' + index}>{item.Item}</Text>
                                                    <Text style={styledStyles.amount} key={'amount' + index}>${item.ActualIncomeAmount.toFixed(2)}</Text>
                                               </View>
                                            </View>
                                    )}
                                 <View style={{flexDirection:'row'}}> 
                                     <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}} key={'item' + index}>Income Items Totals</Text>
                                     <Text style={[styledStyles.item_total,{borderTopWidth:1, borderColor:'grey'}]} key={'total' + index}>${this.onTotalIncomeItem(item, 'Income').toFixed(2)}</Text>
                                 </View>
                                 
                                 <Text style={{fontWeight:'bold', fontSize:17, color:'black'}}>Deduction Items</Text>
                                    {
                                        this.props.Income.filter((obj) => obj.Source == item && obj.Type == 'Deduction').map((item: object, index: number) => 
                                            <View style={{marginLeft:15}}>
                                               <View style={{flexDirection:'row'}}> 
                                                    <Text style={{flex:2}} key={'item' + index}>{item.Item}</Text>
                                                    <Text style={styledStyles.amount} key={'amount' + index}>(${item.ActualIncomeAmount.toFixed(2)})</Text>
                                               </View>
                                            </View>
                                    )}
                                 <View style={{flexDirection:'row'}}> 
                                     <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}} key={'item' + index}>Deduction Items Totals</Text>
                                    <Text style={[styledStyles.item_total,{borderTopWidth:1, borderColor:'grey'}]} key={'total' + index}>(${this.onTotalIncomeItem(item, 'Deduction').toFixed(2)})</Text>
                                 </View>
                                
                             </View>
                            <View style={{flexDirection:'row'}}> 
                                <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}} key={'item' + index}>{item} Totals</Text>
                                <Text style={[styledStyles.parent_item_total,{borderTopWidth:1, borderColor:'grey'}]} key={'total' + index}>${this.onTotalAllItems(item).toFixed(2)}</Text>
                            </View>
                         </View>
                     )}
                 </View>
                <View style={{flexDirection:'row'}}> 
                   <Text style={{flex:2, fontWeight:'bold', fontSize:17, color:'black'}}>Income Totals</Text>
                   <Text style={[styledStyles.parent_income_total,{borderTopWidth:1, borderColor:'grey'}]}>${this.onTotalIncome()}</Text>
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
        textAlign:'right',
        paddingRight:25
    },
    parent_item_total: {

        flex:1,
        marginLeft:20,
        fontWeight:'bold',
        fontSize:17,
        textAlign:'right',
        color:'black',
        paddingRight:25
    },
    parent_income_total: {

        flex:1,
        marginLeft:20,
        fontWeight:'bold',
        fontSize:17,
        color:'black',
        textAlign:'right',
        paddingRight:25
    }
});