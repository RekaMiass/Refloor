import type { RoomParams, PlankParams, Calculations } from '../types';

interface ControlsProps {
  room: RoomParams;
  setRoom: (r: RoomParams) => void;
  plank: PlankParams;
  setPlank: (p: PlankParams) => void;
  layoutType: 'herringbone' | 'straight';
  setLayoutType: (t: 'herringbone' | 'straight') => void;
  wallColor: string;
  setWallColor: (c: string) => void;
  calc: Calculations;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="control-row">
      <div className="control-label">
        <span>{label}</span>
        <span className="control-value">{value} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

export default function Controls({
  room,
  setRoom,
  plank,
  setPlank,
  layoutType,
  setLayoutType,
  wallColor,
  setWallColor,
  calc,
}: ControlsProps) {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Refloor</h2>
      <p className="sidebar-subtitle">3D Room Configurator</p>

      <section className="section">
        <h3>Room Dimensions</h3>
        <Slider label="Length" value={room.length} min={2} max={15} step={0.1} unit="m"
          onChange={(v) => setRoom({ ...room, length: v })} />
        <Slider label="Width" value={room.width} min={2} max={15} step={0.1} unit="m"
          onChange={(v) => setRoom({ ...room, width: v })} />
        <Slider label="Height" value={room.height} min={2} max={4} step={0.05} unit="m"
          onChange={(v) => setRoom({ ...room, height: v })} />
      </section>

      <section className="section">
        <h3>Floor Layout</h3>
        <div className="toggle-row">
          <button
            className={layoutType === 'herringbone' ? 'btn active' : 'btn'}
            onClick={() => setLayoutType('herringbone')}
          >
            Herringbone
          </button>
          <button
            className={layoutType === 'straight' ? 'btn active' : 'btn'}
            onClick={() => setLayoutType('straight')}
          >
            Straight
          </button>
        </div>
        <Slider label="Plank Length" value={plank.length} min={300} max={1200} step={50} unit="mm"
          onChange={(v) => setPlank({ ...plank, length: v })} />
        <Slider label="Plank Width" value={plank.width} min={60} max={200} step={10} unit="mm"
          onChange={(v) => setPlank({ ...plank, width: v })} />
        <Slider label="Gap" value={plank.gap} min={0} max={5} step={0.5} unit="mm"
          onChange={(v) => setPlank({ ...plank, gap: v })} />
      </section>

      <section className="section">
        <h3>Wall Color</h3>
        <div className="color-row">
          {['#f5f0e8', '#d4c5a9', '#a8c5da', '#c5d4a8', '#d4a8a8', '#c5a8d4', '#a8b5c5'].map((c) => (
            <button
              key={c}
              className={`color-swatch ${wallColor === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setWallColor(c)}
            />
          ))}
          <input
            type="color"
            value={wallColor}
            onChange={(e) => setWallColor(e.target.value)}
            title="Custom color"
          />
        </div>
      </section>

      <section className="section results">
        <h3>Calculations</h3>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">Floor Area</span>
            <span className="result-value">{calc.floorArea} m²</span>
          </div>
          <div className="result-item">
            <span className="result-label">Wall Area</span>
            <span className="result-value">{calc.paintArea} m²</span>
          </div>
          <div className="result-item">
            <span className="result-label">Paint Needed</span>
            <span className="result-value">{calc.paintLiters} L</span>
          </div>
          <div className="result-item">
            <span className="result-label">Skirting</span>
            <span className="result-value">{calc.skirtingMeters} m</span>
          </div>
          <div className="result-item">
            <span className="result-label">Planks (net)</span>
            <span className="result-value">{calc.totalPlanks} pcs</span>
          </div>
          <div className="result-item">
            <span className="result-label">Planks (+10% waste)</span>
            <span className="result-value">{calc.planksWithWaste} pcs</span>
          </div>
        </div>
      </section>
    </div>
  );
}
