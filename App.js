

import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Modal, StyleSheet, Text, Image, View, FlatList, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import * as Location from 'expo-location';


 export default function App() {

  const DATA = [

  
  ];
  const [weather, setWeather] = useState(DATA);
  const [weeklyWeather, setWeeklyWeather] = useState(DATA);


  const fetchData = async (city)=>{
    
    const api_key = "c079791633a7b22588ecb7ef1d77301e";

    let url 
    if(city!= undefined && city.latitude != undefined && city.longitude != undefined){
      url = "https://api.openweathermap.org/data/2.5/onecall?lat="+ city.latitude +"&lon="+city.longitude+"&appid=" + api_key;
   
    }
    else {
      url = "https://api.openweathermap.org/data/2.5/onecall?lat=43.65&lon=-79.38&appid=" + api_key;
   
    }


    let response = await fetch(url)
    let weatherResponse = await response.json();

    return weatherResponse;
    
  }

 
  const getWeatherData = async (city)=>{
    console.log(city + " ")
    const response = await fetchData(city)
    .then(weather => {
      setIsError(false); 
      setWeather(weather) 
    console.log(weather)

    })
    .catch((err)=>{
      setIsError(true); setWeather([]); console.error(err);
    })
    


    //get feels like and icon and date
  let i = 0;
  let weekly_weather = []
  if(weather.daily != undefined){
    for(let day of weather.daily){
 
      let unix_time_stamp = day.dt;
      let time_mili_seconds = unix_time_stamp * 1000 ;
      let day_date = new Date(time_mili_seconds);
     // console.log("DAY: "+day_date.getDay())
      let day_of_week = days_of_week[day_date.getDay()];
      
      //convert from Kelvin to Celsius 
      let feels_like = Math.round(day.feels_like.eve - 273.15);
      let weather_description = day.weather[0].description;
      let weather_icon = day.weather[0].icon
      
      let newDayWeather = {
        id: i++,
        date: day_date,
        day_of_week: day_of_week,
        feels_like: feels_like,
        weather_description: weather_description,
        weather_icon: weather_icon
      }


      weekly_weather = [...weekly_weather, newDayWeather];

    }
    console.log(weekly_weather)
    setWeeklyWeather(weekly_weather);
  }
  

 
    //console.log(weather)
    setIsLoading(false)
 
    


  }



const Row = ({item, onPress})=>{
  //console.log(item.feels_like)
  const [post, setPost] = useState(item);
return (

    <TouchableOpacity style={styles.item} onPress={(item)=>onPress(post)}>
            <Text style={styles.title}>{item.day_of_week}     
            
            <Text style={styles.weatherDescription}>          {item.weather_description}</Text></Text>
      <Text style={styles.feelsLikeText}>{item.feels_like + " C"}</Text>
      
      <Image 
      style={styles.weatherImage}
      source ={{
        
        uri: "http://openweathermap.org/img/wn/"+item.weather_icon+"@2x.png"
        
      }}/>
          <Text> 
            {JSON.stringify(gpsLocation)}
            </Text>
        { gpsLocationFound && 
                (<Text> 
                 {JSON.stringify(gpsLocation) + "sdf "}
                </Text>)
        }
   
    </TouchableOpacity>

)};




  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelected] = useState(-1);
  const [ location, setLocation] = useState(null);
  const days_of_week = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  

  }

  const [gpsLocation, setGpsLocation] = useState({lat:null, lng:null});
  const [gpsLocationFound, setGpsLocationFound] = useState(false);

  const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log(status)
      if (status !== 'granted') {
        setIsError(true);
        setGpsLocationFound(false);
        return -1;
      }
      try{
        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
      setGpsLocation(location);
      setGpsLocationFound(true);
      console.log("we found  location")
      console.log(location)
      return location;
      }
      catch(e){
        console.log(e)
        setGpsLocationFound(false);
        setIsError(true)
        return -1;
      }
      
    }


  


  useEffect(()=>{
    getLocation().then((loc)=>{
      if(loc==-1){
        loc = {lat: 49, lng: -70}
  
      }
      getWeatherData(loc)
      .then((weatherData)=>{console.log("we got: "+weatherData)});
      
  


    });
  }, []);




  const renderRow = ({item})=>{
    return(
  <Row 
    item={item} 
    onPress={(item)=>setSelected(item.id)}></Row>
    )
  }



  return (
    <SafeAreaView style={styles.container}>
      <Modal  visible={isError} animationType='fade' transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text>Error loading data. Try again later.</Text>
          <TouchableOpacity
        style={styles.errorModalDismissButton}
        onPress={()=>setIsError(false)}>
          <Text>Dismiss</Text>
        </TouchableOpacity>
        </View>
   
        </View>
      </Modal>
      
      {isLoading ? <>
      <ActivityIndicator size='large' color='#00cccc'>
      </ActivityIndicator>
      <Text>Loading...</Text>
      </> :
      <>
        { weeklyWeather && 
        (<View>
          
      
               <Text>{selectedItem}</Text>
              <FlatList data={weeklyWeather} renderItem={renderRow} keyExtractor={item=>item.id}></FlatList>
        </View>
        
   )}

   
      
        </>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6663',
    alignItems: 'center',
    justifyContent: 'center',
    color: "white",
    alignItems: 'stretch',
    marginTop: StatusBar.currentHeight || 0,
  },
  item:{
    backgroundColor:'#FEFFFE',
    padding: 20,
    width: '100%',
    marginVertical:2,
  },
  title:{
    fontSize:28,
  },
  feelsLikeText: {
    fontSize:20,

  },
  weatherDescription:{
    textAlign: "center",
    color: "grey",
  },
  weatherImage: {
    width: 80,
    height: 80,
  },
  modalView: {
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
  errorModalDismissButton: {
    alignItems: "center",
    backgroundColor: "#3f50d0",
    borderRadius: 20,
    padding: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
});
