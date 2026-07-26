import React from 'react';
import ShapeGrid from '..//../components/ShapeGrid';

export const About = () => {
  return (
<>
<div className="relative w-full min-h-screen overflow-hidden">
<div className="absolute inset-0 opacity-40">

<div style={{ width: '100%', height: '600px', position: 'relative' }}>
<ShapeGrid 
speed={0.5}
squareSize={40}
direction='diagonal' // up, down, left, right, diagonal
borderColor="#2F293A"
hoverFillColor='#222'
shape='square' // square, hexagon, circle, triangle
hoverTrailAmount={0} // number of trailing hovered shapes (0 = no trail)
  direction="diagonal"
  hoverColor="#222222"
  size={40}
  shape="square"
/>

</div>
</div>
</div>
</>
  );
};

export default About;