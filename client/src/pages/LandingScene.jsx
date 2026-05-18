import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useLandingScrollYRef } from './landingScrollContext.jsx';

/**
 * Larger = belt moves farther per px of vertical scroll (tunable “marquee speed”).
 * Example: ~6 × full-viewport (~900px scroll) traverses roughly one belt period.
 */
export const TOPIC_BELT_SCROLL_SENSITIVITY = 0.0068;

/** High-contrast chart colors — punch on white */
const BULL = '#00e676';
const BULL_LINE = '#00c853';
const BULL_DEEP = '#00a152';
const BEAR = '#ff1744';
const BEAR_DEEP = '#d50032';

const TOPICS = [
  { key: 'tribe', title: 'TRIBES', line: 'Tribes & polls', color: '#6d28d9', accent: '#a78bfa' },
  { key: 'news', title: 'NEWS', line: 'News & sentiment', color: '#1d4ed8', accent: '#60a5fa' },
  { key: 'ai', title: 'AI', line: 'Signals & rationales', color: '#4338ca', accent: '#818cf8' },
  { key: 'pnl', title: 'P&L', line: 'Portfolio book', color: BULL_DEEP, accent: BEAR },
];

/** Card backdrop width ≈ usable text column from glyph edge */
const CARD_W = 1.42;
const CARD_H = 0.54;

function generateOhlcv(n) {
  const rows = [];
  let prevClose = 0;
  for (let i = 0; i < n; i++) {
    const open = i === 0 ? 0 : prevClose;
    const wave = Math.sin(i * 0.42) * 0.2 + Math.cos(i * 0.19) * 0.11;
    const spike = i % 9 === 0 ? 0.18 : i % 11 === 0 ? -0.16 : 0;
    const close = open + wave * 0.35 + spike;
    const bodyRange = Math.abs(close - open);
    const wickExtra = 0.05 + (i % 5) * 0.024;
    const high = Math.max(open, close) + wickExtra + bodyRange * 0.35;
    const low = Math.min(open, close) - wickExtra - bodyRange * 0.28;
    rows.push({
      open,
      high,
      low,
      close,
      bullish: close >= open,
    });
    prevClose = close;
  }
  return rows;
}

function Candle3D({
  cx,
  open,
  high,
  low,
  close,
  bullish,
  yScale,
  bodyWidth,
  wickWidth,
}) {
  const bodyLow = Math.min(open, close) * yScale;
  const bodyHigh = Math.max(open, close) * yScale;
  const bodyH = Math.max(0.066, Math.abs(bodyHigh - bodyLow));
  const centerY = (bodyLow + bodyHigh) / 2;
  const wickH = Math.max(bodyH + 0.04, (high - low) * yScale);
  const wickY = ((high + low) / 2) * yScale;

  const bodyColor = bullish ? BULL : BEAR;
  const wickColor = bullish ? BULL_DEEP : BEAR_DEEP;

  return (
    <group position={[cx, 0, 0]}>
      <mesh position={[0, wickY, 0]}>
        <boxGeometry args={[wickWidth, wickH, wickWidth]} />
        <meshStandardMaterial
          color={wickColor}
          metalness={0.15}
          roughness={0.32}
          emissive={wickColor}
          emissiveIntensity={0.72}
        />
      </mesh>
      <mesh position={[0, centerY, 0.02]}>
        <boxGeometry args={[bodyWidth, bodyH, bodyWidth * 1.06]} />
        <meshStandardMaterial
          color={bodyColor}
          metalness={0.25}
          roughness={0.26}
          emissive={bodyColor}
          emissiveIntensity={1.05}
        />
      </mesh>
    </group>
  );
}

function TopicGlyph({ type }) {
  if (type === 'tribe') {
    return (
      <group scale={0.38}>
        <mesh position={[-0.16, 0.08, 0]}>
          <sphereGeometry args={[0.12, 14, 14]} />
          <meshStandardMaterial color="#a78bfa" metalness={0.35} roughness={0.35} emissive="#7c3aed" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.18, 0.1, 0]}>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="#c4b5fd" metalness={0.3} roughness={0.38} emissive="#6d28d9" emissiveIntensity={0.28} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.32} roughness={0.36} emissive="#5b21b6" emissiveIntensity={0.32} />
        </mesh>
      </group>
    );
  }
  if (type === 'news') {
    return (
      <group scale={0.46} rotation={[0, 0, -0.08]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.38, 0.04]} />
          <meshStandardMaterial color="#ffffff" metalness={0.12} roughness={0.45} />
        </mesh>
        <mesh position={[0.06, 0.02, 0.03]}>
          <boxGeometry args={[0.34, 0.05, 0.02]} />
          <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.45} metalness={0.2} roughness={0.4} />
        </mesh>
      </group>
    );
  }
  if (type === 'ai') {
    return (
      <mesh scale={0.34}>
        <icosahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial
          color="#818cf8"
          wireframe
          emissive="#6366f1"
          emissiveIntensity={0.85}
          metalness={0.8}
          roughness={0.15}
        />
      </mesh>
    );
  }
  return (
    <group scale={0.44}>
      <mesh position={[-0.14, 0.02, 0]}>
        <boxGeometry args={[0.22, 0.34, 0.06]} />
        <meshStandardMaterial color={BULL} emissive={BULL} emissiveIntensity={0.55} metalness={0.25} roughness={0.35} />
      </mesh>
      <mesh position={[0.16, -0.04, 0]}>
        <boxGeometry args={[0.22, 0.28, 0.06]} />
        <meshStandardMaterial color={BEAR} emissive={BEAR} emissiveIntensity={0.55} metalness={0.25} roughness={0.35} />
      </mesh>
    </group>
  );
}

function TopicMarqueeCard({ topic, laneX }) {
  const stripe = topic.accent || topic.color;
  /** Text column: keep inside card (glyph uses ~左边 0.55 world units) */
  const textAnchorX = -0.1;
  const textMax = 0.62;

  return (
    <group position={[laneX, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[CARD_W, CARD_H, 0.07]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.18}
          roughness={0.32}
          emissive={topic.color}
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0, CARD_H / 2 - 0.02, 0.042]}>
        <boxGeometry args={[CARD_W + 0.02, 0.048, 0.035]} />
        <meshStandardMaterial color={stripe} emissive={stripe} emissiveIntensity={0.5} metalness={0.25} roughness={0.35} />
      </mesh>
      <group position={[-CARD_W / 2 + 0.22, 0, 0.07]}>
        <TopicGlyph type={topic.key} />
      </group>
      <Text
        position={[textAnchorX, 0.1, 0.075]}
        fontSize={0.078}
        lineHeight={1.05}
        color="#111827"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#ffffff"
        maxWidth={textMax}
        overflowWrap="break-word"
      >
        {topic.title}
      </Text>
      <Text
        position={[textAnchorX, -0.12, 0.075]}
        fontSize={0.05}
        lineHeight={1.12}
        color="#475569"
        anchorX="left"
        anchorY="middle"
        maxWidth={textMax}
        overflowWrap="break-word"
      >
        {topic.line}
      </Text>
    </group>
  );
}

/** Topic strip position follows page scroll (no autonomous motion). */
function ScrollSyncedTopicBelt() {
  const root = useRef(null);
  const scrollYRef = useLandingScrollYRef();

  const cardPitch = CARD_W + 0.22;
  const period = TOPICS.length * cardPitch;

  useFrame(() => {
    if (!root.current) return;
    const y = scrollYRef.current ?? 0;
    const travel = y * TOPIC_BELT_SCROLL_SENSITIVITY;
    root.current.position.x = -THREE.MathUtils.euclideanModulo(travel, period);
  });

  return (
    <group position={[1.85, -0.98, 0.72]} rotation={[0.06, -0.32, 0]}>
      <group ref={root}>
        <group>
          {TOPICS.map((topic, ti) => (
            <TopicMarqueeCard key={`a-${topic.key}`} topic={topic} laneX={ti * cardPitch} />
          ))}
        </group>
        <group position={[period, 0, 0]}>
          {TOPICS.map((topic, ti) => (
            <TopicMarqueeCard key={`b-${topic.key}`} topic={topic} laneX={ti * cardPitch} />
          ))}
        </group>
      </group>
    </group>
  );
}

export default function LandingSceneContent() {
  const n = 20;
  const spacing = 0.44;
  const startX = -((n - 1) * spacing) / 2;
  const yScale = 2.95;
  const data = useMemo(() => generateOhlcv(n), [n]);

  return (
    <>
      <color attach="background" args={['#ffffff']} />

      <ambientLight intensity={1.12} />
      <hemisphereLight args={['#ffffff', '#f8fafc', 1]} />
      <directionalLight position={[10, 18, 12]} intensity={2.05} color="#ffffff" />
      <directionalLight position={[-14, -2, -6]} intensity={0.85} color="#ffe4e6" />
      <directionalLight position={[8, 2, -10]} intensity={1.15} color={BULL_LINE} />
      <pointLight position={[0, 3.5, 7]} intensity={92} color={BULL} distance={36} decay={2} />
      <pointLight position={[5, -0.8, -2]} intensity={52} color={BEAR} distance={22} decay={2} />

      <group position={[0.2, 0.2, -0.2]} rotation={[0.1, -0.28, 0]}>
        {data.map((row, i) => {
          const cx = startX + i * spacing;
          return (
            <Candle3D
              key={`ochl-${String(i)}`}
              cx={cx}
              open={row.open}
              high={row.high}
              low={row.low}
              close={row.close}
              bullish={row.bullish}
              yScale={yScale}
              bodyWidth={0.3}
              wickWidth={0.068}
            />
          );
        })}
      </group>

      <ScrollSyncedTopicBelt />
    </>
  );
}
