import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const SimpleMapTest = () => {
  console.log('🧪 SimpleMapTest component loaded');
  
  return (
    <div style={{ width: '100%', height: '400px', background: 'yellow', border: '3px solid purple' }}>
      <h3>Simple Map Test</h3>
      <ComposableMap 
        width={800} 
        height={400}
        style={{ border: '2px solid green' }}
      >
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json">
          {({ geographies }: any) => {
            console.log('🧪 Simple test geographies loaded:', geographies?.length);
            return geographies.map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  console.log('🧪 SIMPLE TEST - Mouse enter worked!');
                }}
                onClick={() => {
                  console.log('🧪 SIMPLE TEST - Click worked!');
                }}
                style={{
                  default: { fill: '#D6D6DA', stroke: '#000', strokeWidth: 0.5 },
                  hover: { fill: '#F53', cursor: 'pointer' },
                  pressed: { fill: '#E42' },
                }}
              />
            ));
          }}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default SimpleMapTest;
