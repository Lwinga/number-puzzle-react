import NumberBox from "./NumberBox.jsx";

export default function PuzzleBox({
  rows = 3
}) {
  const boxSize = 60;
  const size = 60 * rows;
  const totalBoxes = rows * rows - 1;
  const boxes = [];

  for (let x = 0, box = 0; x < rows; x++) {
    for (let y = 0; y < rows && box < totalBoxes; y++, box++) {
      const label = x + y * rows + 1;
      boxes.push(
        <NumberBox
          key={label}
          label={label}
          size={boxSize}
          positionX={x}
          positionY={y}
        />
      )
    }
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        border: '2px solid black',
        boxSizing: 'content-box',
      }}
    >
      {boxes}
    </div>
  )
}
