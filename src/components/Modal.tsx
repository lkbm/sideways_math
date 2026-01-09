// Reusable modal wrapper component

import type { ComponentChildren, JSX } from 'preact';
import { cn } from '../utils/classNames';

interface ModalProps {
  children: ComponentChildren;
  onOverlayClick: () => void;
  className?: string;
}

export function Modal({ children, onOverlayClick, className }: ModalProps) {
  function handleContentClick(e: Event): void {
    e.stopPropagation();
  }

  return (
    <div class="modal-overlay" onClick={onOverlayClick}>
      <div class={cn('modal', className)} onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
}
