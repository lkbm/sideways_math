// Help modal explaining how to play

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal help-modal" onClick={e => e.stopPropagation()}>
        <h2>How to Play</h2>

        <div class="help-content">
          <p>
            Solve cryptarithmetic puzzles where each letter represents a unique digit (0-9).
          </p>

          <h3>Example</h3>
          <pre class="example-puzzle">{`   SEND
 + MORE
───────
  MONEY`}</pre>
          <p>
            If S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2, then 9567 + 1085 = 10652
          </p>

          <h3>Rules</h3>
          <ul>
            <li>Each letter maps to exactly one digit</li>
            <li>Each digit maps to at most one letter</li>
            <li>The first letter of each word cannot be 0</li>
          </ul>

          <h3>Feedback Colors</h3>
          <div class="feedback-legend">
            <div class="legend-item">
              <span class="legend-tile feedback-green">A=5</span>
              <span>Correct! This letter is this digit.</span>
            </div>
            <div class="legend-item">
              <span class="legend-tile feedback-yellow">B=3</span>
              <span>The digit 3 is used, but for a different letter.</span>
            </div>
            <div class="legend-item">
              <span class="legend-tile feedback-gray">C=9</span>
              <span>The digit 9 isn't used in the solution at all.</span>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" onClick={onClose} type="button">
          Got it!
        </button>
      </div>
    </div>
  );
}
