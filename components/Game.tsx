import React, {useState,useEffect} from 'react';
import { Button, Text, View } from 'native-base';
import {styles} from './Stylesheet';
import MapView, { Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import * as geolib from 'geolib';

interface Player {
    id: number;
    distance: number;
}
export default function Game() {
    const [location, setLocation] = useState(null);
    const [startingpoint, setStartingpoint] = useState(null);
    const [throwDistance, setThrowDistance] = useState(null);
    const [polylineCoordinates, setPolylineCoordinates] = useState([]);
    const [playerScore, setPlayerScore] = useState([]);
    const [curPlayer, setCurPlayer] = useState<Player>({id: 0, distance: 0});
    const [gameStarted, setGameStarted] = useState(false);
    const [winner,setWinner] = useState<Player>(null);
    
    const mapRef = React.useRef<MapView>(null);

    useEffect(() => {
        //Pohjautuu on https://docs.expo.io/versions/latest/sdk/location/
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }
                const location = await Location.getCurrentPositionAsync({});
                updateLocation(location);
                if (!startingpoint) {
                    setStartingpoint(location.coords);
                    setPolylineCoordinates([{latitude: location.coords.latitude, longitude: location.coords.longitude}])
                } else {
                    //Pohjautuen  https://www.npmjs.com/package/geolib
                    const distance = startingpoint && geolib.getDistance(
                      {latitude: startingpoint.latitude, longitude: startingpoint.longitude},
                      {latitude: location.coords.latitude, longitude: location.coords.longitude}
                    );
                    //Polyline coordinates are used to draw a line on the map 
                    setThrowDistance(distance);
                    setPolylineCoordinates([...polylineCoordinates, {latitude: location.coords.latitude, longitude: location.coords.longitude}])
                }
            } catch (error) {
                    console.log(error);
            }
        };
        if(gameStarted){
            getLocation();
        }
    }, [gameStarted]);

    useEffect(() => {
        let initialLocation: any = null;
        const startWatching = async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }
                initialLocation = await Location.watchPositionAsync(
                    {accuracy: Location.Accuracy.High, distanceInterval:1},
                    (location) => updateLocation(location),
                );
                
            } catch(error) {
                console.log(error);
            }
        };
                startWatching();

            return () => {
                if(initialLocation) {
                    initialLocation.remove();
                }
            }
    },[gameStarted]);

    const updateLocation = (location) => {
        if(!startingpoint) {
            setStartingpoint(location.coords);
            setPolylineCoordinates([{latitude: location.coords.latitude, longitude: location.coords.longitude}])
        } else {
            const newPolylineCoordinates = [{latitude: startingpoint.latitude, longitude: startingpoint.longitude}, {latitude: location.coords.latitude, longitude: location.coords.longitude}    ];
            setPolylineCoordinates(newPolylineCoordinates);
            const distance =  startingpoint && geolib.getDistance(
                {latitude: startingpoint.latitude, longitude: startingpoint.longitude},
                {latitude: location.coords.latitude, longitude: location.coords.longitude}
            );
            setThrowDistance(distance);
            }
          setLocation(location);
    }     
    

    useEffect(() => {
        if (location && mapRef.current) {
            const lastCoords = polylineCoordinates[polylineCoordinates.length - 1];
            const distance = startingpoint && geolib.getDistance(
                {latitude: lastCoords.latitude, longitude: lastCoords.longitude},
                {latitude: location.coords.latitude, longitude: location.coords.longitude}
            );
            if (distance > 5) {
            mapRef.current.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
            });
            }
        }
    }, [location]);

    const Region =  location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
    } : null;
    
    const voittaja = () => {
        const playerScores = [...playerScore, { id: 4, distance: curPlayer.distance }];
        const sorttaus = playerScores.sort((a,b) => b.distance - a.distance);
        const tie = sorttaus.length > 1 && sorttaus[0].distance === sorttaus[1].distance;
        if(!tie && sorttaus.length > 0){
            setWinner(sorttaus[0]);
        } else {
            setWinner(null);
        }
        
    };
    return(
        <View style={styles.container}>
            {location && (
                <MapView style={styles.map} 
                region={Region}
                showsUserLocation={true}
                followsUserLocation={false}
                ref={mapRef}
                >
                {startingpoint && 
                    <Marker 
                    coordinate={{latitude: startingpoint.latitude, longitude: startingpoint.longitude}}
                    title="Starting point"
                    />
                }
                {polylineCoordinates.length > 0 && (
                    <Polyline
                    coordinates={[...polylineCoordinates]}
                    strokeColor='black'
                    strokeWidth={2} 
                    lineDashPattern={[5, 5]}/>
                )}
                </MapView>
            )}
            {!gameStarted && (
                <View style={styles.startGameView}>
                    <Text style={styles.startGame}>Peli on suunniteltu neljälle henkilölle. Aloittakaa heittämällä jotain esinettä tietystä paikasta ja sen jälkeen aloittakaa mittaus painamalla aloita peli</Text>
                        <Button style={styles.buttonView}  onPress={() => {
                            setCurPlayer({id:1, distance:throwDistance})
                            setGameStarted(true);
                        }}>Aloita peli</Button>
                </View>
            )}
            {gameStarted && playerScore.length < 4 && (
                <View style={styles.gameView}>
                    <Text style={styles.gameStatHeader}>Kävele heitetylle esineelle</Text>
                    <Text style={styles.gameStat}>Pelaaja {curPlayer.id} | Heiton pituus: {throwDistance}</Text>
                    <Button style={styles.buttonViewSave} onPress={() => {
                    setPlayerScore([...playerScore, curPlayer])
                    if(curPlayer.id < 4) {
                        setCurPlayer({id: curPlayer.id + 1, distance: throwDistance})
                    } else {
                        voittaja();
                        setCurPlayer({id:0, distance: 0});
                    }
                    }}>Tallenna heitto</Button>
                </View>
            )}
             
             {playerScore.length === 4 && (
                <View style={styles.score}>
                    <Text style={styles.scoreText}>Tulokset:</Text>
                        {playerScore.map((player, index) => {
                        return (
                            <View style={styles.scoreText} key={index}>
                            <Text style={styles.scoreText}>Pelaaja {index + 1}</Text>
                            <Text style={styles.scoreText}>{player.distance} metriä</Text>
                            <Text style={{height:1,backgroundColor:'black'}}></Text>
                            </View>
                        );
                        })}
                        <Text style={styles.scoreText}>Voittaja:</Text>
                        <Text style={styles.winnerText}>
                            {winner ? (
                                <Text>Pelaaja {winner.id}</Text>) : (
                                <Text>Tasapeli</Text>
                            )
                            }
                        </Text>
                    <Button style={styles.newGameButton} onPress={() => {
                        setStartingpoint(null);
                        setPolylineCoordinates([]);
                        setCurPlayer({id:0, distance: 0});
                        setPlayerScore([]);
                        setGameStarted(false);
                        setWinner(null);
                    }}>Aloita uusi peli</Button>
                </View>
             )}
        </View>
    );
}