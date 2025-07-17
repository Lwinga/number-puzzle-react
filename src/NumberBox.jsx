export default function NumberBox({
  label,
  size = 60,
  positionX = 0,
  positionY = 0,
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: `${size / 2}px`,
        fontWeight: 'bold',
        border: '2px solid black',
        backgroundColor: 'coral',
        color: 'white',
        position: 'absolute',
        left: `${positionX * size}px`,
        top: `${positionY * size}px`,
        userSelect: 'none',
      }}
    >
      {label}
    </div>
  )
}
