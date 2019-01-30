## Composable D3 Chart in React 🎉

### Features

- 🧩 Build up your chart with your own components
- 📉 Out-of-the-box chart components available
- 🛠 Use D3 information like scales and interactions
- 🔌 Render React or D3 components within the chart
- 💄 Style with your preferred technology (e.g. styled-components)
- 🤯 Build advanced chart features

### Usage

```js
<D3Chart
  data={data}
  margin={margin}
  xDomain={xDomain}
  yDomain={yDomain}
  xAccessor={xAccessor}
  onZoom={changeXDomain}
>
  {({ xScale, yScale, contentSize }) => (
    <>
      <XAxis xScale={xScale} size={contentSize} animate={animate} />
      <YAxis yScale={yScale} />
      <Spline
        data={data}
        xScale={xScale}
        yScale={yScale}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        styles={splineStyles(color)}
      />
    </>
  )}
</D3Chart>
```
