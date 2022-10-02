import React, { useState, useEffect } from "react";
import { Platform, View, Text, StyleSheet, FlatList, Alert, Modal, Pressable, TouchableOpacity } from 'react-native';
import { BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";


const StockPage = () =>{

    const [user] = useAuth()
    const [data, setData] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState({})
    const [tempState, setTempState] = useState()

    const checkIfTempState = (display) =>{
        if (tempState != null) {
            return tempState;
        } else {
            return display;
        }
    } 

    useEffect(() => {
        fetch(`${BASE_URL}/drones`)
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.log(error))
    }, [])

    const updateState = (id, newStateName) => {
        const newState = data.map(obj => {
          // 👇️ if id equals 2, update country property
          if (obj._id === id) {
            return {...obj, state: newStateName};
          }
          // 👇️ otherwise return object as is
          return obj;
        });
        setData(newState);
      };

    const setModal = (item, index) => {
        if(tempState != null) setTempState(null);
        setModalData(item);
        setModalVisible(true);
    }

    const patchDroneToSend = async (droneId) => {
        const response = await fetch(`${BASE_URL}/drones/${droneId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                state: 'En Location',
            }),
            headers: {
                'content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user.token}`
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
        setTempState('En Location');
        updateState(droneId, 'En Location');
    }
    
    const patchDroneToStock = async (droneId) => {
        const response = await fetch(`${BASE_URL}/drones/${droneId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                state: 'En Stock',
            }),
            headers: {
                'content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user.token}`
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
        setTempState('En Stock');
        updateState(droneId, 'En Stock');
    }

    const patchDroneToSAV = async (droneId) => {
        const response = await fetch(`${BASE_URL}/drones/${droneId}`, {
            method: 'PATCH',
            body: JSON.stringify({
                state: 'SAV',
            }),
            headers: {
                'content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${user.token}`
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
        setTempState('SAV');
        updateState(droneId, 'SAV');
    }

    return(
        <>
        <View style={styles.container}>
            <Text style={ styles.titleSky }>SKY <Text style={ styles.titleBlack }>DR</Text>O<Text style={ styles.titleBlack }>NE</Text></Text>
            <Text style={ styles.titleStock }>aperçu du stock</Text>
                
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.textDroneNameModal}>{modalData.name_d}</Text>
                        <Text style={styles.textStateModal}>Statut : <Text style={checkIfTempState(modalData.state) == 'En Stock' ? styles.textStateDrone : styles.textStateDroneUnavailable && modalData.state == 'En Location' ? styles.textStateDroneResa : styles.textStateDroneUnavailable}>{checkIfTempState(modalData.state)}</Text></Text>
                        <View style={styles.containerBtn}>
                        {checkIfTempState(modalData.state) == 'En Stock' ?
                            <TouchableOpacity
                            style={[styles.button, styles.buttonToSend]}
                            onPress={() => patchDroneToSend(modalData._id)}
                            underlayColor='#fff'>
                            <Text style={styles.textStyle}>LOCATION</Text>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity
                                style={[styles.button, styles.buttonToStock]}
                                onPress={() => patchDroneToStock(modalData._id)}
                                underlayColor='#fff'>
                                <Text style={styles.textStyle}>STOCK</Text>
                            </TouchableOpacity>
                        }
                            <TouchableOpacity
                                style={[styles.button, styles.buttonToSAV]}
                                onPress={() => patchDroneToSAV(modalData._id)}
                                underlayColor='#fff'>
                                <Text style={styles.textStyle}>SAV</Text>
                            </TouchableOpacity>
                        </View>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>FERMER</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <FlatList
                style={styles.cell}
                data={data}
                keyExtractor={(data) => data.id}
                renderItem={({ item, index }) =>
                    <View style={styles.card}>
                        <Pressable
                            onPress={() => setModal(item, index)}
                        >
                            <Text style={styles.textDroneName}>{item.name_d}</Text>
                            <Text style={styles.textState}>Statut : <Text style={item.state == 'En Stock' ? styles.textStateDrone : styles.textStateDroneUnavailable && item.state == 'En Location' ? styles.textStateDroneResa : styles.textStateDroneUnavailable}>{item.state}</Text></Text>
                        </Pressable>
                    </View>
                }
            />
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    containerBtn: {
        alignSelf: "center"
    },
    ...Platform.select({
        ios:{
            centeredView:{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 22,
            },
            modalView:{
                margin: 20,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
            },
            button:{
                borderRadius: 20,
                padding: 15,
                marginTop: 50,
                elevation: 2,
            },
            buttonClose:{
                backgroundColor: "#2196F3",
            },
            buttonToSend:{
                backgroundColor: "orange",
            },
            buttonToSAV:{
                backgroundColor: "firebrick",
            },
            buttonToStock:{
                backgroundColor: "forestgreen",
            },
            textStyle: {
                color: "white",
                fontWeight: "bold",
                textAlign: "center"
            },
            modalText: {
                marginBottom: 15,
                textAlign: "center"
            },
            container: {
                flex: 1,
                backgroundColor: "#fff",
                alignItems: "center",
            },
            cell:{
                width: 425,
            },
            titleStock:{
                marginBottom: 20,
                marginTop: 5,
                padding: 10,
                borderRadius: 15,
                color: "#3caae9",
                letterSpacing: 2,
                textAlign: "center",
                fontSize: 18,
                textTransform: "uppercase",
            },
            titleSky:{
                marginBottom: 10,
                marginTop: 10,
                padding: 10,
                borderRadius: 15,
                color: "#3caae9",
                letterSpacing: 2,
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold",
            },
            titleBlack:{
                color: 'black'
            },
            textStateDrone:{
                padding: 10,
                letterSpacing: 1,
                fontSize: 18,
                textAlign: "center",
                color: "#32cd32",
                fontWeight: "bold"
            },
            textStateDroneUnavailable:{
                color: '#dc143c',
                padding: 10,
                letterSpacing: 1,
                fontSize: 18,
                textAlign: "center",
                fontWeight: "bold"
            },
            textStateDroneResa:{
                color: '#ff8c00',
                padding: 10,
                letterSpacing: 1,
                fontSize: 18,
                textAlign: "center",
                fontWeight: "bold"
            },
            textState:{
                padding: 10,
                letterSpacing: 1,
                fontSize: 18,
                textAlign: "center",
            },
            textStateModal:{
                padding: 5,
                letterSpacing: 1,
                textAlign: "center",
            },
            card:{
                padding: 25,
                margin: 20,
                borderRadius:20,
                borderWidth: 1,
            },
            listWrapper:{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderBottomWidth: 1,
            },
            text:{
                flex: 1,
                fontSize: 14,
                textAlign: 'center',
                textTransform: 'capitalize',
                padding: 10,
        
            },
            textDroneName:{
                flex: 1,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                padding: 10,
            },
            textDroneNameModal:{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                padding: 10
            },
            title: {
                marginBottom: 20,
                marginTop: 20,
                padding: 10,
                borderRadius: 15,
                color: "#3caae9",
                letterSpacing: 2,
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                textTransform: 'uppercase'
            }
        },
        android:{
            textDroneName:{
                flex: 1,
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                padding: 10,
            },
        },
        default:{
            //
        }

    })
})

export default StockPage;