import React, { useRef, useMemo } from 'react';
import { useTransition, animated } from 'react-spring';
import { useMeasure } from 'react-use';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

const defaultMarginTop = 10;
const defaultMarginRight = 10;
const defaultMarginBottom = 10;
const defaultMarginLeft = 10;
const defaultItemHeight = 40;

const calculateLayout = (elements, marginTop, marginRight, marginBottom, marginLeft, containerWidth) => {
  // let t0 = performance.now()
  let currentRow = 0;
  let currentTopOffset = 0;
  let currentLeftOffset = 0;
  let spaceRemainingX = containerWidth;

  const nextRow = () => {
    currentRow += 1;
    currentTopOffset += marginTop + defaultItemHeight + marginBottom;
    currentLeftOffset = 0;
    spaceRemainingX = containerWidth;
  };

  const positions = [];
  elements.forEach((e, i) => {
    let elementWidth = e.props.style.width; // FIX - If the elements' values are AnimatedValues,
    // we need to extract the actual width value from there.

    if (typeof elementWidth === "object") {
      elementWidth = elementWidth.value;
    }

    const necessarySpaceX = marginLeft + elementWidth + marginRight;

    if ( // FIXME -- There is a weird behavior because of bigger boxes than the
    // container width. which makes the grid behave weirdly. Maybe if boxes 
    // are wider than container width we always need to jump line.
    spaceRemainingX <= necessarySpaceX && containerWidth > necessarySpaceX || necessarySpaceX >= containerWidth && i !== 0) {
      nextRow();
    }

    positions.push({
      row: currentRow,
      top: currentTopOffset + marginTop,
      left: currentLeftOffset + marginLeft
    });
    spaceRemainingX -= necessarySpaceX;
    currentLeftOffset += necessarySpaceX;
  });
  return positions; // let t1 = performance.now()
  // console.log(`Call to calculateLayout took ${t1 - t0} milliseconds.`)
};

function GridComponent(props) {
  const {
    style: {
      width: containerWidth
    },
    children,
    itemMarginTop = defaultMarginTop,
    itemMarginRight = defaultMarginRight,
    itemMarginBottom = defaultMarginBottom,
    itemMarginLeft = defaultMarginLeft
  } = props;
  const positions = useRef(new Array(children.length));
  const refMeasures = children.map(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [size, {
      width,
      height
    }] = useMeasure();
    return {
      size,
      width,
      height
    };
  });
  const gridItems = useMemo(() => {
    calculateLayout(children, itemMarginTop, itemMarginRight, itemMarginBottom, itemMarginLeft, containerWidth).forEach((e, i) => {
      positions.current[i] = _extends({}, positions.current[i], e);
    });
    let gridItemsCalcs = children.map((item, i) => {
      // console.log(`--- start log ---`)
      // refMeasures.forEach((e: any, i: number) => {
      //   console.log(`element ${children[i].key} width: ${e.width}`)
      // })
      // console.log(`---- end log ----`)
      return _extends({}, item, {
        top: positions.current[i].top,
        left: positions.current[i].left,
        width: refMeasures[i].width
      });
    });
    return gridItemsCalcs;
  }, [// dependencies: container's width, 
  // and size of each contained element
  containerWidth, refMeasures.map(e => e.width), refMeasures.map(e => e.height)]);
  const transitions = useTransition(gridItems, el => el.key, {
    from: ({
      top,
      left
    }) => ({
      top,
      left,
      opacity: 0
    }),
    enter: ({
      top,
      left
    }) => ({
      top,
      left,
      opacity: .5
    }),
    update: ({
      top,
      left
    }) => ({
      top,
      left,
      opacity: .5
    })
  });
  return React.createElement("div", null, React.createElement(animated.div, {
    style: {
      width: props.style.width,
      height: props.style.height
    },
    key: 1
  }, (children == null ? void 0 : children.length) && transitions.map((el, i) => {
    const {
      item,
      props: {
        top,
        left,
        width
      }
    } = el,
          rest = _objectWithoutPropertiesLoose(el.props, ["top", "left", "width"]);

    return React.createElement(animated.div, {
      key: item.key,
      style: _extends({
        position: "absolute",
        border: "1px solid black",
        width,
        height: refMeasures[i].height,
        top: top == null ? void 0 : top.interpolate(top => `${top}px`),
        left: left == null ? void 0 : left.interpolate(left => `${left}px`)
      }, rest)
    }, React.cloneElement(children[i], {
      ref: refMeasures[i].size
    }));
  })));
}

export { GridComponent };
//# sourceMappingURL=index.modern.js.map
