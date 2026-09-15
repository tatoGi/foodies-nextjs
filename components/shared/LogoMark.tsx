const SIZES = {
  sm: 20,
  md: 30
} as const;

export default function LogoMark({size = 'md'}: {size?: keyof typeof SIZES}) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: '"Signika", sans-serif',
        fontWeight: 800,
        fontSize: SIZES[size],
        lineHeight: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#1a1a1a'
      }}
    >
      Bite<span style={{color: 'var(--theme)'}}>Club</span>
    </span>
  );
}
