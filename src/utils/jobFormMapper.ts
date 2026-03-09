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
  // Education: API may return educations "id1,id2", education_id, education { _id }, or array
  const education = toIdArray(
    job?.educations ?? job?.education_id ?? job?.education
  );

  // Experience: API may return experiences "id1,id2", experience_id, experience { _id }, or array
  const experience = toIdArray(
    job?.experiences ?? job?.experience_id ?? job?.experience
  );

  // Certification: API may return certifications "id1,id2", certification_id, certification { _id }, or array
  const certification = toIdArray(
    job?.certifications ?? job?.certification_id ?? job?.certification
  );

  // Languages: array of { id, level } (proficiency: Basic/Conversational/Fluent/Native)
  const rawLangs = job?.languages;
  let languages: { id: string; level: string }[] = [];
  if (Array.isArray(rawLangs)) {
    languages = rawLangs
      .map((v: any) => {
        const id = typeof v === 'object' ? (v?._id ?? v?.id) : String(v);
        const level = typeof v === 'object' ? (v?.level ?? '') : '';
        return id ? { id: String(id), level: level || '' } : null;
      })
      .filter(Boolean) as { id: string; level: string }[];
  } else if (rawLangs) {
    const ids = toIdArray(rawLangs);
    languages = ids.map(id => ({ id, level: '' }));
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
