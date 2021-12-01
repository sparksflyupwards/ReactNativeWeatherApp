import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Modal, StyleSheet, Text, Image, View, FlatList, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import Geolocation from 'react-native-geolocation-service';


 export default function App() {

  const DATA = [
  
  ];
  const [weather, setWeather] = useState(DATA);
  const [weeklyWeather, setWeeklyWeather] = useState(DATA);




 
  const getWeatherData = async (city)=>{
    

    const api_key = "dc59a7f25db8c6bd34e3a18d78ffc24c";
    //const url  = `http://api.openweathermap.org/data/2.5/weather?q=${city.city},,&units=metric&appid=${api_key}`
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=43.65&lon=-79.38&appid=dc59a7f25db8c6bd34e3a18d78ffc24c";

    
    await fetch(url).then((response)=>response.json())
    .then((json)=>{setIsError(false); setWeather(json) })
    .catch((err)=>{setIsError(true); setWeather([]); console.error(err);})
    .finally(()=>{


      return;
    }
   );


  }



const Row = ({item, onPress})=>{
  console.log(item.feels_like)
  const [post, setPost] = useState(item);
return (

    <TouchableOpacity style={styles.item} onPress={(item)=>onPress(post)}>
            <Text style={styles.title}>{item.day_of_week}</Text>
      <Text style={styles.feelsLikeText}>{item.feels_like + " C"}</Text>
      
      <Image 
      style={styles.weatherImage}
      source ={{
        
        uri: "http://openweathermap.org/img/wn/"+item.weather_icon+"@2x.png"
        
      }}/>
   
    </TouchableOpacity>

)};


  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelected] = useState(-1);
  const [ location, setLocation] = useState(null);
  const days_of_week = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Satday",
    7: "Sunday",

  }


  useEffect(()=>{


    getWeatherData("toronto")
    .then(()=>{
        //get feels like and icon and date
      let i = 0;
      let weekly_weather = []
      if(weather.daily != undefined){
        for(let day of weather.daily){
     
          let unix_time_stamp = day.dt;
          let time_mili_seconds = unix_time_stamp * 1000 ;
          let day_date = new Date(time_mili_seconds);
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
      

     

        setIsLoading(false)
    }



    
    )
  }, []);


  const renderRow = ({item})=>{
    return(
  <Row 
    item={item} 
    onPress={(item)=>setSelected(item.id)}></Row>
    )
  }

/** 
 let _requestLocation = (resolve) => {
    

    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 150000,
    })
        .then(location => {
            setLocation(location);
            resolve(location)
        })
        .catch(ex => {
            const { code, message } = ex;
            console.warn(code, message);
            if (code === 'CANCELLED') {
                Alert.alert('Location cancelled by user or by another request');
            }
            if (code === 'UNAVAILABLE') {
                Alert.alert('Location service is disabled or unavailable');
            }
            if (code === 'TIMEOUT') {
                Alert.alert('Location request timed out');
            }
            if (code === 'UNAUTHORIZED') {
                Alert.alert('Authorization denied');
            }
            setLocation(null);
        });
}
*/

  return (
    <SafeAreaView style={styles.container}>
      <Modal  visible={isError} animationType='fade' transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Text>Error loading data. Try again later.</Text>
        </View>
        </View>
      </Modal>
      
      {isLoading ? <><ActivityIndicator size='large' color='#00cccc'></ActivityIndicator><Text>Loading...</Text></> :
      <>
        <Text>{selectedItem}</Text>
        <FlatList data={weeklyWeather} renderItem={renderRow} keyExtractor={item=>item.id}></FlatList>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
});
