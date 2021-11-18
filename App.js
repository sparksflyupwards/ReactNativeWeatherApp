import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Modal, StyleSheet, Text, View, FlatList, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';






 export default function App() {

  const DATA = [
  
  ];
  



  

  const [weather, setWeather] = useState(DATA);
  const [weeklyWeather, setWeeklyWeather] = useState(DATA);




 
  const getWeatherData = async (city)=>{
    const api_key = "dc59a7f25db8c6bd34e3a18d78ffc24c";
    //const url  = `http://api.openweathermap.org/data/2.5/weather?q=${city.city},,&units=metric&appid=${api_key}`
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=dc59a7f25db8c6bd34e3a18d78ffc24c";

    
    await fetch(url).then((response)=>response.json())
    .then((json)=>{setIsError(false); setWeather(json) })
    .catch((err)=>{setIsError(true); setWeather([]); console.error(err);})
    .finally(()=>{


      //get feels like and icon and date
      let i = 0;
   
      for(let day of weather.daily){
        
        let unix_time_stamp = day.dt;
        let time_mili_seconds = unix_time_stamp * 1000 ;
        let day_date = new Date(time_mili_seconds);
        
        
        let feels_like = day.feels_like.eve;
        let weather_description = day.weather[0].description;
        let weather_icon = day.weather[0].icon
        
        let newDayWeather = {
          id: i,
          date: day_date,
          feels_like: feels_like,
          weather_description: weather_description,
          weather_icon: weather_icon
        }

        i++;
        setWeeklyWeather([...weeklyWeather, newDayWeather])
      }

     

      return setIsLoading(false)
    }
   );


  }



const Row = ({item, onPress})=>{
  console.log(item.feels_like)
  const [post, setPost] = useState(item);
return (

    <TouchableOpacity style={styles.item} onPress={(item)=>onPress(post)}>
      <Text style={styles.title}>{item.feels_like}</Text>
    </TouchableOpacity>

)};


  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelected] = useState(-1);
  


  useEffect(()=>{
    getWeatherData("toronto")
    .then(()=>
    console.log(
      "weather"
    )
    )
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: "white",
    marginTop: StatusBar.currentHeight || 0,
  },
  item:{
    backgroundColor:'#ccaacc',
    padding: 20,

    marginHorizontal: 16,
    marginVertical:8,
  },
  title:{
    fontSize:28,
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
