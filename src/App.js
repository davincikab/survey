import React, { useState, useEffect }  from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature, Marker, Cluster } from 'react-mapbox-gl';
import TextInput from './components/TextInput';
import Button from './components/Button';

import InputGroup from './components/InputGroup';

// import data from './assets/data.json';
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
  const [data, setData] = useState({
    "type":"FeatureCollection",
    "features":[]
  });

  useEffect(() => {
    // get data from the database
    // axios.get('/').then(response => {
    //   createGeojson(response);
    // })
  },[]);

  // create geojson
  const createGeojson = (dataItems) => {
    let geojObj = JSON.parse(JSON.stringify(data));

    dataItems = dataItems[0] ? dataItems : [values];

    dataItems.forEach((item,i) => {
      let feature = {
        "geometry":{
          "coordinates":item.coordinates
        },
        "properties":{ 
            ...item, 
            id:i
        }
      }

      geojObj.features.push(feature);
    });

    // update the data 
    setData(geojObj);
  }

  // update form values
  const changeHandler = (event) => {
    const target = event.target;
    const {name, value} = target;

    setValues({...values, [name]:value});
  }

  // cluster Marker factory
  const clusterMarker = (coordinates, pointCount) => (
    <Marker 
      key={Math.random()}
      coordinates={coordinates} 
      style={styles.clusterMarker}>
      {pointCount}
    </Marker>
  );

  // handle marker click event: update popup content
  const onMarkerClick = (feature) => {
    console.log(feature);
    setPopupContent(feature);
  
  }

  // create the question option
  const renderOptions = (options, name) => {
    var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m"];
    return (
      <div>
        { 
        options.map((option, key) => (
          <div
            key={key}
          >
            <input type="radio" name={name} onChange={changeHandler} value={option} required/>
            <label> {alphabet[key]}. {option}</label>
          </div>
          ))
        }
      </div>
    )
  }

  // commit form input 
  const commitData = (coord) => {
    console.log(values);

    setSurveySession(false);
    createGeojson([
      {
        ...values,
        coordinates:coord
      }
    ]);
    // axios.post(
    //   '/',
    //   {
    //     ...values
    //   }
    // )
    // .then(response => {
    //   if(response.status == 200) {
    //     setSurveySession(false);
    //   }
    // })
    // .catch(error => {
    //   alert(error.message);
    // });
    
  }

  // geocode the address
  const geocodeData = async (address) => {
    let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?&access_token='+accessToken;
    
    let data = await fetch(url).then(res => res.json())
                  .catch(() => {
                        return [];
                  });
      
                
    if(data) {
      // update the form data
      setValues({...values, coordinates:data.features[0].geometry.coordinates});

      // call axios to submit the data
      commitData(data.features[0].geometry.coordinates);

    } else{
      setErrors({...errors, address:"invalid address"})
    }
    
  }
  // submit the data
  const handleSubmit = (event) => {
    event.preventDefault();

    geocodeData(values.street+' '+ values.city, values.country);

  };

  const zoomendHandler = (map) => {
    let currentZoom = map.getZoom();
    let currentCenter = map.getCenter();

    setZoom(currentZoom);
    setCenter(currentCenter);

  }

  // toggle description
  const toggleDescription = () => {
    setPopupContent({});
  }

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

              {
                data.type &&
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
                            feature={feature}
                            options={questions}
                          />
                      </Marker>
                    )
                  }
                </Cluster>
              } 

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
                  <h5 className="title">{popupContent.properties.street} {popupContent.properties.city}, {popupContent.properties.country}</h5>
                 <p className="text">Fealing <b>{popupContent.properties.one}</b></p>
                 <p className="text">Period <b>{popupContent.properties.two}</b></p>
                 <p className="text">Doctor Visit <b>{popupContent.properties.three}</b></p>
              </div>
            }
          </div>
          {
            !surveySession &&
            <button 
              className="btn btn-float"
              onClick={() => setSurveySession(true)}
            >Add Entry + </button>
          }
         
          {
          surveySession &&
          <div className="form-section">

              <h4 className="title">Kindly fill all the questions</h4>
              <form onSubmit={handleSubmit}>
                  {
                    questions.map((question, key) => (
                      <div className="question" key={key}>
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
  // color codes and list option
  let colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'];
  let options = questions[0].options;

  // create color object
  let colorsObject = options.reduce((pv,cv,i) => {
    pv[cv] = colors[i]
    return pv;
  },{});

  // get the color
  const color = colorsObject[props.feature.properties.one];

  // return the div
  return (
    <div 
      key={props.feature.properties.id.toString()}
      style={{
        backgroundColor:color,
        ...styles.marker, 
      }}
    >
    </div>
  )
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
