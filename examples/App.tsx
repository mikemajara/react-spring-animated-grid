import React, { useState } from "react";
import Grid from '../src/GridComponent'
import { defaultItemWidth } from '../src/defaults'
import { animated, useSpring, useTransition } from 'react-spring'

export default function App() {  

  const widthIncreaseStep = 5

  // The height of the content inside of the accordion
  const [containerWidth, setContainerWidth] = useState(220);

  const toggleContentWidth = (factor: number) => {
    if (factor === 0) return
    setContainerWidth(containerWidth*factor)
  }

  const toggleItemWidth = (key: string) => {
    const idx: number = elements.findIndex(e => e.key === key)
    if (idx >= 0){
      elements[idx].width[1]( 
        elements[idx].width[0] === defaultItemWidth
          ? defaultItemWidth * ((Math.floor(Math.random() * 10) % 3) + 2)
          : defaultItemWidth
      )
    }
  }

  const elements = [
    { key: "Miguel", width: useState(100)},
    { key: "Alcalde", width: useState(100)},
    // { key: "c", width: useState(40)},
    // { key: "d", width: useState(40)},
    // { key: "e", width: useState(40)},
    // { key: "f", width: useState(40)},
    // { key: "g", width: useState(40)},
    // { key: "h", width: useState(40)},
  ]

  // const transitions = useTransition(elements, el => el.key, {
  const transitions = useTransition(
    elements,
    item => item.key,
    {
      from: (el) => ({width: el.width[0]}),
      enter: (el) => ({width: el.width[0]}),
      update: (el) => ({width: el.width[0]}),
    }
  )

  return (
    <div>
      <Grid
        style={{
          width: containerWidth,
          height: 320
        }}
      >
        { elements.map((item, idx) =>
            <animated.div
              key={item.key}
              style={{
                // FIXME -- This fails to pass on the width
                // down because the value is not a plain one,
                // its a transition value. Check what value 
                // arrives at the parent component.
                width: transitions[idx].props.width,
                height: 40,
                border: "1px solid green",
                display: "flex",
                justifyContent: "center"
              }}
              onClick={() => {
                toggleItemWidth(item.key);
              }}
            >
              {item.key}
            </animated.div>
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
