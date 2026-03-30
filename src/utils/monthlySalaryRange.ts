/**
 * Normalizes + formats the API salary fields for display.
 *
 * The backend can send either:
 * - `monthly_salary_range` as a string like "2000-3000" or "10000+"
 * - OR legacy numeric fields `monthly_salary_from`/`monthly_salary_to`
 *
 * Requirement: display should prefer `monthly_salary_range`.
 */

const toNumberOrNaN = (val: any): number => {
  if (val === null || val === undefined) return NaN;
  const str = String(val).trim();
  if (!str || str === '-') return NaN;
  return Number(str.replace(/,/g, ''));
};

export const formatMonthlySalaryRangeText = (range: any): string => {
  const raw =
    range === null || range === undefined ? '' : (String(range).trim() as string);
  if (!raw || raw === '-') return '';

  // Normalize spaces around separators (e.g. "2000 - 3000" => "2000-3000")
  const normalized = raw.replace(/\s*-\s*/g, '-').replace(/\s*\+\s*/g, '+');
  if (normalized.includes('+')) {
    const from = toNumberOrNaN(normalized.replace('+', ''));
    return Number.isFinite(from) ? `${from.toLocaleString()}+` : normalized;
  }

  const parts = normalized.split('-');
  if (parts.length >= 2) {
    const from = toNumberOrNaN(parts[0]);
    const to = toNumberOrNaN(parts[1]);
    if (Number.isFinite(from) && Number.isFinite(to)) {
      return `${from.toLocaleString()} - ${to.toLocaleString()}`;
    }
    // Fallback: keep normalized string but with nicer spacing.
    return normalized.replace('-', ' - ');
  }

  return normalized;
};

export const getJobMonthlySalaryRangeText = (job: any): string => {
  // Prefer the API key requested by the user.
  const range = job?.monthly_salary_range;
  const formatted = formatMonthlySalaryRangeText(range);
  if (formatted) return formatted;

  // Fallback to legacy fields if range is missing.
  const from = toNumberOrNaN(job?.monthly_salary_from);
  const to = toNumberOrNaN(job?.monthly_salary_to);
  if (Number.isFinite(from) && Number.isFinite(to)) {
    return `${from.toLocaleString()} - ${to.toLocaleString()}`;
  }
  if (Number.isFinite(from) && (!job?.monthly_salary_to || job?.monthly_salary_to === '-')) {
    return `${from.toLocaleString()}+`;
  }
  return '';
};

export const getJobMonthlySalaryBounds = (
  job: any,
): { min: number; max: number } => {
  const rangeText = job?.monthly_salary_range;
  const normalized =
    rangeText === null || rangeText === undefined ? '' : String(rangeText).trim();

  if (normalized && normalized !== '-') {
    const n = normalized.replace(/\s*-\s*/g, '-').replace(/\s*\+\s*/g, '+');
    if (n.includes('+')) {
      const min = toNumberOrNaN(n.replace('+', ''));
      return { min: Number.isFinite(min) ? min : 0, max: Number.POSITIVE_INFINITY };
    }
    const [a, b] = n.split('-');
    const min = toNumberOrNaN(a);
    const max = toNumberOrNaN(b);
    return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 };
  }

  // Fallback to legacy fields.
  const min = toNumberOrNaN(job?.monthly_salary_from);
  const max = toNumberOrNaN(job?.monthly_salary_to);
  return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 0 };
};

