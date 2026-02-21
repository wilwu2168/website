import { useMemo } from 'react'
import * as THREE from 'three'

export function GroundGrid() {
  const points = useMemo(() => {
    const points = []
    const size = 20
    const divisions = 20
    const step = size / divisions

    for (let i = 0; i <= divisions; i++) {
      const pos = (i * step) - size / 2
      
      // Horizontal lines
      points.push(-size / 2, 0.01, pos)
      points.push(size / 2, 0.01, pos)
      
      // Vertical lines  
      points.push(pos, 0.01, -size / 2)
      points.push(pos, 0.01, size / 2)
    }
    
    return new Float32Array(points)
  }, [])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#555" opacity={0.3} transparent />
    </lineSegments>
  )
}