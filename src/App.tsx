import React, { useState } from "react";
import Grid from './GridComponent'
import {defaultItemWidth} from './helpers'

export default function App() {  

  // const toggleItemWidth = (key: string) => {
  //   const idx = elements.findIndex(e => e.key === key)
  //   if (idx >= 0){
  //     elements[idx].size[1]( 
  //       elements[idx].size[0] === defaultItemWidth
  //         ? defaultItemWidth * ((Math.floor(Math.random() * 10) % 3) + 2)
  //         : defaultItemWidth
  //     )
  //   }
  // }

  const elements = [
    { key: "amigo" },
    { key: "mio" },
    { key: "solo" },
    { key: "tu" },
    { key: "encuentras" },
    { key: "leña" },
  ]

  return (
    <div>
      <Grid>
        { elements.map(item =>
            <div
              key={item.key}
              style={{
                // width: item.size[0],
                // height: 40,
                border: "1px solid blue",
                display: "flex",
                justifyContent: "center"
              }}
              // onClick={() => {
              //   toggleItemWidth(item.key);
              // }}
            >
              {item.key}
            </div>
          )
        }
      </Grid>
      <div>
        { elements.map(item =>
            <div
              key={item.key}
              style={{
                // width: item.size[0],
                // height: 40,
                border: "1px solid blue",
                display: "flex",
                justifyContent: "center"
              }}
              // onClick={() => {
              //   toggleItemWidth(item.key);
              // }}
            >
              {item.key}
            </div>
          )
        }
      </div>
      
    </div>
  );
}
