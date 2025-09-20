import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WizardProgress } from '@/components/wizard-progress';

describe('WizardProgress', () => {
  it('marks steps up to current as active', () => {
    render(<WizardProgress steps={['a', 'b', 'c']} currentStepIndex={1} />);

    const badges = screen.getAllByText(/\d/);
    expect(badges).toHaveLength(3);
    expect(badges[0].className).toContain('bg-indigo-600');
    expect(badges[1].className).toContain('bg-indigo-600');
    expect(badges[2].className).toContain('border-slate-200');
  });
});
