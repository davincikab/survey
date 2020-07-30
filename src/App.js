import React from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
  accessToken:
  'pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA'
});

function App() {
  return (
    <div className="App">
      <div className="row">
          <div className="col-8">
            <Map
              style="mapbox://styles/mapbox/streets-v9"
              containerStyle={{
                height: '80vh',
                width: '100%'
              }}
            >
              <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
                <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
              </Layer>
            </Map>
          </div>
          <div className="col-4 section">
              <form>
                <h5>User Details Form</h5>
              </form>
          </div>
      </div>
    </div>
  );
}

export default App;
