// Decorative bouncing rubber balls background
// Inspired by Wayside School playground balls

export function BouncingBalls() {
  return (
    <div class="bouncing-balls-container" aria-hidden="true">
      {/* Green balls - bounce highest and fastest */}
      <div class="bouncing-ball ball-green ball-green-1" />
      <div class="bouncing-ball ball-green ball-green-2" />
      {/* Red balls - moderate bounce */}
      <div class="bouncing-ball ball-red ball-red-1" />
      <div class="bouncing-ball ball-red ball-red-2" />
      {/* Yellow balls - barely peek onto screen */}
      <div class="bouncing-ball ball-yellow ball-yellow-1" />
      <div class="bouncing-ball ball-yellow ball-yellow-2" />
    </div>
  );
}
