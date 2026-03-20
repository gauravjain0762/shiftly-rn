/**
 * Maps job API response to job form state for Edit Job flow.
 * Handles various API response shapes (single id, object, comma-separated, array).
 */

const toIdArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((v: any) => (typeof v === 'object' && v?._id ? v._id : String(v))).filter(Boolean);
  }
  if (typeof val === 'string') {
    return val.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  if (typeof val === 'object' && val?._id) return [val._id];
  return [];
};

const toSingleSelect = (val: any): { label: string; value: string } | null => {
  if (!val) return null;
  if (typeof val === 'object') {
    const id = val._id ?? val.id ?? val.value;
    const label = val.title ?? val.label ?? val.name ?? id ?? '';
    if (id) return { label: String(label), value: String(id) };
  }
  if (typeof val === 'string' && val.trim()) {
    return { label: val.trim(), value: val.trim() };
  }
  return null;
};

const toSingleSelectFromId = (id: string | undefined, labelFallback?: string): { label: string; value: string } | null => {
  if (!id || !String(id).trim()) return null;
  const sid = String(id).trim();
  return { label: labelFallback ?? sid, value: sid };
};

export const mapJobToFormState = (job: any) => {
  const education = toIdArray(
    job?.educations ?? job?.education_id ?? job?.education
  );

  const experience = toIdArray(
    job?.experiences ?? job?.experience_id ?? job?.experience
  );

  const certification = toIdArray(
    job?.certifications ?? job?.certification_id ?? job?.certification
  );

  const rawLangs = job?.languages ?? job?.language_ids;
  let languages: { id: string; level: string; name?: string }[] = [];
  if (Array.isArray(rawLangs) && rawLangs.length > 0) {
    languages = rawLangs
      .map((v: any) => {
        if (v == null) return null;
        const id =
          typeof v === 'object'
            ? (v?.language_id?._id ?? v?.language_id ?? v?._id ?? v?.id ?? v?.value ?? v?.name ?? (typeof v?.language_id === 'string' ? v.language_id : null))
            : String(v);
        const level = typeof v === 'object' ? (v?.level ?? '') : '';
        const name = typeof v === 'object' ? (v?.name ?? v?.language_id?.title ?? v?.language_id?.name ?? '') : '';
        if (!id || String(id).trim() === '') return null;
        return { id: String(id).trim(), level: level || '', ...(name ? { name: String(name).trim() } : {}) };
      })
      .filter(Boolean) as { id: string; level: string; name?: string }[];
  } else if (rawLangs) {
    const ids = toIdArray(rawLangs);
    languages = ids.filter(id => id && String(id).trim()).map(id => ({ id: String(id).trim(), level: '' }));
  }

  // Other requirements (job_requirements)
  const other_requirements = toIdArray(job?.job_requirements);

  // Skills: array of { _id, title } or comma-separated string
  const skillsArray = Array.isArray(job?.skills)
    ? job.skills
    : typeof job?.skills === 'string'
      ? job.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
  const skillId = skillsArray.map((s: any) => (typeof s === 'object' && s?._id ? s._id : String(s)));
  const jobSkills = skillsArray.map((s: any) => (typeof s === 'object' && s?.title ? s.title : String(s)));

  const rawBenefits = job?.essential_benefits;
  const essential_benefits = Array.isArray(rawBenefits)
    ? rawBenefits
        .map((b: any) => {
          if (typeof b === 'object' && b != null && (b._id || b.id)) {
            return { _id: b._id || b.id, title: b.title ?? b.name ?? '' };
          }
          if (typeof b === 'string' && b.trim()) return { _id: b.trim(), title: '' };
          return null;
        })
        .filter(Boolean)
    : [];

  return {
    education,
    experience,
    certification,
    languages,
    other_requirements,
    skillId,
    jobSkills,
    essential_benefits,
  };
};
