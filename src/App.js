import React from "react";
import Grid from './GridComponent'
import Item from './ItemComponent'


// FIXME -- There is a weird behavior because of bigger boxes than the
// container width. which makes the grid behave weirdly. Maybe if boxes 
// are wider than container width we always need to jump line.
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
