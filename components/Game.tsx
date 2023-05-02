import React, {useState,useEffect} from 'react';
import {Text,Button,View} from 'react-native';
import {styles} from './Stylesheet';
import MapView, { Marker, Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import * as geolib from 'geolib';

export default function Game() {
    const [location, setLocation] = useState(null);
    const [startingpoint, setStartingpoint] = useState(null);
    const [throwDistance, setThrowDistance] = useState(null);
    const [polylineCoordinates, setPolylineCoordinates] = useState([]);
    const [isMapCentered, setIsMapCentered] = useState(false);
    
    const mapRef = React.useRef<MapView>(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }
                const location = await Location.getCurrentPositionAsync({});
                setLocation(location);

                if (!startingpoint) {
                    setStartingpoint(location.coords);
                    setPolylineCoordinates([{latitude: location.coords.latitude, longitude: location.coords.longitude}])
                } else {
                    const distance =  geolib.getDistance(
                      {latitude: startingpoint.latitude, longitude: startingpoint.longitude},
                      {latitude: location.coords.latitude, longitude: location.coords.longitude}
                    );
                    setThrowDistance(distance);
                    setPolylineCoordinates([...polylineCoordinates, {latitude: location.coords.latitude, longitude: location.coords.longitude}])
                }
            } catch (error) {
                    console.log(error);
            }
        };
        getLocation();
    }, []);

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
                    {accuracy: Location.Accuracy.BestForNavigation, distanceInterval:1},
                    (location) => handleMoving(location),
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
    },[]);

    const handleMoving = (location) => {
        if(!startingpoint) {
            setStartingpoint(location.coords);
            setPolylineCoordinates([{latitude: location.coords.latitude, longitude: location.coords.longitude}]);
          } else {
            const newPolylineCoordinates = [{latitude: startingpoint.latitude, longitude: startingpoint.longitude}, {latitude: location.coords.latitude, longitude: location.coords.longitude}    ];
            setPolylineCoordinates(newPolylineCoordinates);
            const distance =  geolib.getDistance(
                {latitude: startingpoint.latitude, longitude: startingpoint.longitude},
                {latitude: location.coords.latitude, longitude: location.coords.longitude}
            );
            if (distance > 5) {
                mapRef.current.animateToRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0009,
                    longitudeDelta: 0.0009,
                });
            }
            setThrowDistance(distance);
          }
          setLocation(location);
    }     
    const handleInitialMap = () => {
        if(!isMapCentered) {
            setIsMapCentered(true);
        };
    }

    useEffect(() => {
        if (location && mapRef.current) {
            const lastCoords = polylineCoordinates[polylineCoordinates.length - 1];
            const distance =  geolib.getDistance(
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
            setIsMapCentered(true);
            }
        }
    }, []);

    const Region =  location ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
    } : null;


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
                        coordinates={polylineCoordinates}
                        strokeColor='black'
                        strokeWidth={2} 
                        lineDashPattern={[5, 5]}/>
                )}
                </MapView>
            )}
            {throwDistance && (
                <View style={styles.distanceView}>
                    <Text style={styles.distanceText}>
                    Distance: {throwDistance.toFixed(2)} meters
                    </Text>
                </View>
             )}
        </View>
    );
}