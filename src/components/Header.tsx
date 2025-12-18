// Game header with title and help

interface HeaderProps {
  onHelpClick: () => void;
}

export function Header({ onHelpClick }: HeaderProps) {
  return (
    <header class="header">
      <h1>Sideways Arithmetic</h1>
      <button
        class="help-btn"
        onClick={onHelpClick}
        type="button"
        aria-label="Help"
      >
        ?
      </button>
    </header>
  );
}
