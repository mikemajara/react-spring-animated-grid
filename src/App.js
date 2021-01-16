import React from "react";
import Grid from './GridComponent'
import Item from './ItemComponent'

export default function App() {  
  return (
    <div>
      <Grid>
        <Item
          style={{
            width: 40,
            height: 40,
          }}
        >
          hola
        </Item>
        <Item
          style={{
            width: 40,
            height: 40,
          }}
        >
          hola
        </Item>
      </Grid>
    </div>
  );
}
