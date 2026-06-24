export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#07070b]">
      {/* Ambient gradient orbs */}
      <div className="orb-a absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="orb-b absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="orb-a absolute -bottom-48 left-1/4 h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/15 blur-[120px]" />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
        }}
      />
    </div>
  );
}
