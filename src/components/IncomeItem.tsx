import React, { Component } from 'react';
import { Text, StyleSheet,View,TouchableOpacity,Button } from 'react-native';
import { Icon } from 'native-base';


export default class IncomeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {     
     
       income:props.income
    };
  }

  componentWillMount() {

    this.setState ({

        income:this.props.income
    })
  }
  render() {
    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.line} >Date  :  {this.state.income.ActualIncomeDate}</Text>
                <Text style={styles.line}>Source  :  {this.state.income.Source}</Text>
                <Text style={styles.line}>Total  :  {this.state.income.ActualIncomeAmount}</Text>
            </View>

            <View style = { styles.nav_bar}>

                <TouchableOpacity style={{ width: 60, height: 25, borderWidth:1,borderColor:'orange', borderRadius:10 }}
                    onPressOut={() => this.props.onGoDetail(this.state.income)}>
                    <Text style={{textAlign:'center', color:'orange'}}>Details</Text>
                 </TouchableOpacity>
                         
                <TouchableOpacity style={{ width: 40, height: 40, marginTop: 5 }}
                     onPressOut={() => this.props.onUpdateIncomeItem(this.state.income)}>
                     <Icon
                        type="SimpleLineIcons"
                        name="note"
                        style={{ fontSize: 16, textAlign: "center", color:'orange'}}
                      />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 40, height: 40, marginTop:5 }}
                    onPressOut={() => this.props.onDeleteIncomeItem(this.state.income.ActualIncomeID)} >
                    <Icon
                        type="SimpleLineIcons"
                        name="trash"
                        style={{ color: 'orange', fontSize: 16, textAlign: "center" }}
                    />
                </TouchableOpacity>
            </View>       
            
        </View>      
    );
  }
}

const styles = StyleSheet.create({
  
    container: {
        
        flexDirection:'column'
    },
    content: {
        
        flexDirection:'column',      
        paddingLeft: 15,
        
    },
    line: {

        height: 30,
        fontSize:15,
        fontWeight:'bold',
        color:'black'
    },
    nav_bar: {
      
        flexDirection:'row',
        marginLeft:15,     
        // justifyContent: 'space-between'
    },
    
});
