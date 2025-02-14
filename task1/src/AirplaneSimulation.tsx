import React, { useRef, useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

const AirplaneControl: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef<Position>({ x: 300, y: 300 });
  const trajectoryRef = useRef<Position[]>([{ x: 300, y: 300 }]);
  const previousTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const [yaw, setYaw] = useState<number>(0);
  const [airspeed, setAirspeed] = useState<number>(100);

  // Keep refs so our animation loop always uses the latest values
  const yawRef = useRef<number>(yaw);
  const airspeedRef = useRef<number>(airspeed);

  useEffect(() => {
    yawRef.current = yaw;
  }, [yaw]);

  useEffect(() => {
    airspeedRef.current = airspeed;
  }, [airspeed]);

  const canvasWidth = 600;
  const canvasHeight = 600;

  // Update the airplane's position on each animation frame
  const update = (time: number) => {
    if (previousTimeRef.current !== null) {
      const dt = (time - previousTimeRef.current) / 1000; // seconds elapsed
      const angleRad = (yawRef.current * Math.PI) / 180; // convert degrees to radians

      let newX =
        positionRef.current.x + airspeedRef.current * Math.cos(angleRad) * dt;
      let newY =
        positionRef.current.y + airspeedRef.current * Math.sin(angleRad) * dt;

      // Wrap around canvas edges
      if (newX > canvasWidth) newX = newX - canvasWidth;
      if (newX < 0) newX = canvasWidth + newX;
      if (newY > canvasHeight) newY = newY - canvasHeight;
      if (newY < 0) newY = canvasHeight + newY;

      // Update the current position and trajectory
      positionRef.current = { x: newX, y: newY };
      trajectoryRef.current.push({ x: newX, y: newY });
      draw();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  };

  // Draw the trajectory and the airplane on the canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw the trajectory as a blue line
    ctx.beginPath();
    const traj = trajectoryRef.current;
    if (traj.length > 0) {
      ctx.moveTo(traj[0].x, traj[0].y);
      for (let i = 1; i < traj.length; i++) {
        ctx.lineTo(traj[i].x, traj[i].y);
      }
    }
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the airplane as a red circle
    ctx.beginPath();
    ctx.arc(positionRef.current.x, positionRef.current.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
  };

  // Start the animation loop when the component mounts
  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>Airplane Control</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Yaw Angle (degrees):{' '}
          <input
            type="range"
            min="0"
            max="180"
            step="1"
            value={yaw}
            onChange={(e) => setYaw(Number(e.target.value))}
          />
        </label>
        <span style={{ marginLeft: '10px' }}>
          Current Yaw Angle: {yaw} degrees
        </span>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Airspeed (knots):{' '}
          <input
            type="range"
            min="0"
            max="3000"
            step="1"
            value={airspeed}
            onChange={(e) => setAirspeed(Number(e.target.value))}
          />
        </label>
        <span style={{ marginLeft: '10px' }}>
          Current Airspeed: {airspeed} knots
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default AirplaneControl;
