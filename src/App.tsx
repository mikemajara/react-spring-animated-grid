import React, { useState } from "react";
import Grid from './GridComponent'
import {defaultItemWidth} from './helpers'
import { animated } from 'react-spring'

export default function App() {  

  const widthIncreaseStep = 5

  // The height of the content inside of the accordion
  const [containerWidth, setContainerWidth] = useState(220);

  const toggleContentWidth = (factor: number) => {
    if (factor === 0) return
    setContainerWidth(containerWidth*factor)
  }

  const toggleItemWidth = (key: string) => {
    const idx = elements.findIndex(e => e.key === key)
    if (idx >= 0){
      elements[idx].size[1]( 
        elements[idx].size[0] === defaultItemWidth
          ? defaultItemWidth * ((Math.floor(Math.random() * 10) % 3) + 2)
          : defaultItemWidth
      )
    }
  }

  const elements = [
    { key: "a", size: useState(40) },
    { key: "b", size: useState(40) },
    { key: "c", size: useState(40) },
    { key: "d", size: useState(40) },
    { key: "e", size: useState(40) },
    { key: "f", size: useState(40) },
    { key: "g", size: useState(40) },
    { key: "h", size: useState(40) },
  ]

  return (
    <div>
      <Grid
        style={{
          width: containerWidth,
          height: 320
        }}
      >
        { elements.map(item =>
            <div
              key={item.key}
              style={{
                width: item.size[0],
                height: 40,
                border: "1px solid purple",
                display: "flex",
                justifyContent: "center"
              }}
              onClick={() => {
                toggleItemWidth(item.key);
              }}
            >
              {item.key}
            </div>
          )
        }
      </Grid>
      <animated.button onClick={() => toggleContentWidth(2/3)} >
        {'2/3'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(1/2)} >
        {'1/2'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(1.5)} >
        {'x1.5'}
      </animated.button>
      <animated.button onClick={() => toggleContentWidth(2)} >
        {'x2'}
      </animated.button>
      
      <animated.button onClick={() => setContainerWidth(containerWidth+widthIncreaseStep)} >
        {'+'}
      </animated.button>
      <animated.button onClick={() => setContainerWidth(containerWidth-widthIncreaseStep)} >
        {'-'}
      </animated.button>
      {/* <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{marginRight: 100}}>
          New calc - containerWidth: {containerWidth}
          <table>
              <thead>
                <tr>
                  <th>el</th>
                  <th>row</th>
                  <th>top</th>
                  <th>left</th>
                </tr>
              </thead>
              <tbody>
              {positions.current.map(({row, top, left}, i) =>
                <tr key={i}>
                  <td>{props.children[i].key}</td>
                  <td>{row}</td>
                  <td>{top}</td>
                  <td>{left}</td>
                </tr>
              )}
              </tbody>
          </table>
        </div>
        <div style={{marginRight: 100}}>
          elements
          <table>
              <thead>
                <tr>
                  <th>el</th>
                  <th>width</th>
                  <th>style</th>
                </tr>
              </thead>
              <tbody>
              {props.children.map((element: ReactElement, i:number) =>
                <tr key={i}>
                  <td>{element.key}</td>
                  <td>{element.props.style.width}</td>
                  <td>{JSON.stringify(element.props.style)}</td>
                </tr>
              )}
              </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
