import React, { useState, StyleS }  from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature, Marker, Cluster } from 'react-mapbox-gl';
// import SliderCheckbox from './components/SliderCheckbox';
// import InputGroup from './components/InputGroup';
import TextInput from './components/TextInput';
import Button from './components/Button';
import data from './assets/data.json';
import questions from './assets/questions.json';
import InputGroup from './components/InputGroup';

const Map = ReactMapboxGl({
  accessToken:
  'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA'
});

function App() {
  const [problemA, setProblemA] = useState(false);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([12.368531078853298, 50.824523354309598])

  const changeHandler = (event) => {
    const target = event.target;
    const {name, value} = target;

    console.log(name + ": " + value);

    setValues({...values, [name]:value})
  }

  const clusterMarker = (coordinates, pointCount) => (
    <Marker 
      key={Math.random()}
      coordinates={coordinates} 
      style={styles.clusterMarker}>
      {pointCount}
    </Marker>
  );

  const onMarkerClick = (e) => {

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
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(values);

  };

  const zoomendHandler = (map, event) => {
    let currentZoom = map.getZoom();
    let currentCenter = map.getCenter();

    setZoom(currentZoom);
    setCenter(currentCenter);

  }

  return (
    <div className="App">
      <div className="">
          <div className="">
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
                      onClick={onMarkerClick}>
                        <MarkerDiv 
                          key={key}
                          problem={feature.properties.problem}
                        />
                    </Marker>
                  )
                }
              </Cluster>
            </Map>
          </div>
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
      </div>
    </div>
  );
}

const MarkerDiv = (props) => {
  // ["#88CCEE", "#CC6677", "#DDCC77", "#117733", "#117733", "#AA4499", "#44AA99", "#999933", "#882255", "#661100", "#6699CC", "#888888"]
  const colors = {
    'Problem A':"#88CCEE",
    'Problem B':"#CC6677",
    'Problem C':"#DDCC77",
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
