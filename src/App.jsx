import PuzzleBox from "./PuzzleBox.jsx";

export default function App() {
  const rows = 3;
  const totalBoxes = rows * rows - 1; // Leave one space empty
  const initialBoxes = [];

  for (let x = 0, box = 0; x < rows; x++) {
    for (let y = 0; y < rows && box < totalBoxes; y++, box++) {
      const label = x + y * rows + 1;
      initialBoxes.push({label, x, y});
    }
  }

  return (
    <PuzzleBox
      initialBoxes={initialBoxes}
    />
  )
}