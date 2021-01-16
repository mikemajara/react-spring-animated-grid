import React from "react";
import Grid from './GridComponent'
import Item from './ItemComponent'

export default function App() {  
  return (
    <div>
      <Grid>
        { ["a","b","c","d","e","f","g","h"].map(e =>
            <Item
              style={{
                width: 40,
                height: 40,
              }}
            >
              {e}
            </Item>
          )
        }
      </Grid>
    </div>
  );
}
