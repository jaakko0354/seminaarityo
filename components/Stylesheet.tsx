import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      height:'100%',
      width:'100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },

    map: {
        height:'100%',
        width:'100%'
    },
    distanceText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'white'
    },
    distanceView: {
        position: 'absolute',
        top: 150,
        backgroundColor: 'grey'
    }
  });

export {styles};