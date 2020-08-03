import React, { useState, useEffect }  from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature, Marker, Cluster, Popup } from 'react-mapbox-gl';
import axios from 'axios';
import TextInput from './components/TextInput';
import Button from './components/Button';

import InputGroup from './components/InputGroup';

import data from './assets/data.json';
import questions from './assets/questions.json';
import otherQuestions from './assets/secondary_questions.json';

import markerUrl from './assets/images/marker.png';

const accessToken = 'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA';

const Map = ReactMapboxGl({
  accessToken:accessToken
});

function App() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([12.368531078853298, 50.824523354309598]);
  const [popupContent, setPopupContent] = useState({});
  const [surveySession, setSurveySession] = useState(true);

  // update form values
  const changeHandler = (event) => {
    const target = event.target;
    const {name, value} = target;

    setValues({...values, [name]:value});
  }

  const clusterMarker = (coordinates, pointCount) => (
    <Marker 
      key={Math.random()}
      coordinates={coordinates} 
      style={styles.clusterMarker}>
      {pointCount}
    </Marker>
  );

  const onMarkerClick = (feature) => {
    setPopupContent(feature);
  
  }

  const renderOptions = (options, name) => {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m"];
    return (
      <div>
        { 
        options.map((option, key) => (
          <div>
            <input type="radio" name={name} onChange={changeHandler} value={option} required/>
            <label> {alphabet[key]}. {option}</label>
          </div>
          ))
        }
      </div>
    )
  }

  // commit form input 
  const commitData = () => {
    axios.post(
      '/',
      {
        ...values
      }
    )
    .then(response => {
      if(response.status == 200) {
        setSurveySession(false);
      }
    })
    .catch(error => {
      alert(error.message);
    });
    
  }

  // geocode the address
  const geocodeData = async (address) => {
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?&access_token='+accessToken;
    
    let data = await fetch(url).then(res => res.json())
                  .catch(error => {
                        return [];
                  });
      
                

    if(data) {
      setValues({...values, coordinates:data.features[0].geometry.coordinates});

      // call axios to submit the data

    } else{
      setErrors({...errors, address:"invalid address"})
    }
    
  }
  // submit the data
  const handleSubmit = (event) => {
    event.preventDefault();

    geocodeData(values.street+' '+ values.city, values.country);

  };

  const zoomendHandler = (map, event) => {
    let currentZoom = map.getZoom();
    let currentCenter = map.getCenter();

    setZoom(currentZoom);
    setCenter(currentCenter);

  }

  // toggle description
  const toggleDescription = (event) => {
    setPopupContent({});
  }

  console.log(values);
  return (
    <div className="App">
      <div className="">
          <div className="row">
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              className="map"
              center={center}
              zoom={[zoom]}
              onZoomEnd={zoomendHandler}
            >
              <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
              </Layer>

              <Cluster 
                ClusterMarkerFactory={clusterMarker}
                zoomOnClick={true}
                radius={100}
                >
                {
                  data.features.map((feature, key) =>
                    <Marker
                      key={key}
                      coordinates={feature.geometry.coordinates}
                      onClick={() => onMarkerClick(feature)}>
                        <MarkerDiv 
                          key={key}
                          problem={feature.properties.problem}
                          options={questions}
                        />
                    </Marker>
                  )
                }
              </Cluster>

              {
                popupContent.geometry &&
                <Marker
                  coordinates={popupContent.geometry.coordinates}
                  anchor="bottom">
                  <img src={markerUrl}/>
                </Marker>
              }
            </Map>
            {
              popupContent.properties &&
              <div className="description">
                <button 
                  className="close-btn"
                  onClick={toggleDescription}
                  >&#215;</button>
                <h6 className="title">Fill the details {popupContent.properties.one}</h6>
                <form onSubmit={handleSubmit}>
                  {
                    otherQuestions.map((question, key) => (
                      <div className="question">
                        <p>{key + 1}. {question.question}</p>
                        {renderOptions(question.options, question.name)}
                      </div>
                    ))
                  }

                  <Button
                    type="submit"
                    text="Submit Questionnaire"
                  />
                </form>
              </div>
            }
          </div>
          {
          surveySession &&
          <div className="form-section">
              <h4 className="title">Kindly fill all the questions</h4>
              <form onSubmit={handleSubmit}>
                  {
                    questions.map((question, key) => (
                      <div className="question">
                        <p>{key + 1}. {question.question}</p>
                        {renderOptions(question.options, question.name)}
                      </div>
                    ))
                  }

                  {
                    ['Country', 'City', 'Street'].map((el, key)=> (
                      <InputGroup
                        label={el}
                        key={key}
                      >
                        <TextInput 
                          type={"text"}
                          name={el.toLocaleLowerCase()}
                          value={values.name}
                          onChange={changeHandler}
                        />
                      </InputGroup>
                    ))
                  }
                  
                  
                  <Button
                    type="submit"
                    text="Submit Quetionnaire"
                  />
              </form>
          </div>
        }
      </div>
    </div>
  );
}

const MarkerDiv = (props) => {
  // ["#88CCEE", "#CC6677", "#DDCC77", "#117733", "#117733", "#AA4499", "#44AA99", "#999933", "#882255", "#661100", "#6699CC", "#888888"]
  console.log(props.options);

  const colors = {
    'Extraordinary':"#88CCEE",
    'Happy':"#CC6677",
    'Casual':"#DDCC77",
    'Problem D':"#117733",
    'Problem E':"#882255" ,
    'Problem F':"#AA4499",
  };

  const color = colors[props.problem];
  return (
    <div 
      style={{
        backgroundColor:color,
        ...styles.marker, 
      }}
    >
    </div>
  )
}

// popup content
const PopupDiv = (props) => {
  return(
    <div className>

    </div>
  );
}

const styles = {
  marker:{
    width:20,
    height:20,
    borderRadius:10,
    cursor:"pointer"
  },
  clusterMarker:{
    width:30,
    height:30,
    borderRadius:15,
    backgroundColor:'#000',
    color:"white",
    textAlign:"center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor:"pointer"
  }
}
export default App;
