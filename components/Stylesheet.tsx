import { position } from 'native-base/lib/typescript/theme/styled-system';
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
    },
    buttonView: {
        backgroundColor: '#0f2e61', 
        width: 100,
        paddingBottom: 10,
    },
    startGameView: {
        position: 'absolute',
        bottom: 300,
        backgroundColor: '#85aae6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 250,
        height:250,

  },
    startGame: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black'
    },
    buttonViewSave: {
        backgroundColor: '#0f2e61',
        height: 50,
        width: 150,
        position: 'absolute',
        bottom: 50,
    },
    gameView: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        width: 300,
        height:250,
    },
    gameStatHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute',
        bottom: 140,
    },
    gameStat: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black',
        position: 'absolute',
        bottom: 100,
    },
    score: {
        position: 'absolute',
        width: '80%',
        height: '85%',
        top: 50,
        backgroundColor: '#85aae6',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black'
    },
    winnerView: {
        width: '100%',
        backgroundColor: 'grey'
    },
    winnerText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'black'
    },
    newGameButton: {
        width:150,
        height: 50,
        marginTop: 20,
        backgroundColor: '#0f2e61',
    }
  });

export {styles};