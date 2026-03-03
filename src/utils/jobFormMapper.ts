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
  // Education: API may return education_id, education { _id, title }, or educations "id1,id2"
  const educationRaw = job?.education_id ?? job?.education ?? (typeof job?.educations === 'string' ? job.educations.split(',')[0] : job?.educations?.[0]);
  const education = toSingleSelect(educationRaw) ?? toSingleSelectFromId(typeof educationRaw === 'string' ? educationRaw : educationRaw?._id);

  // Experience
  const experienceRaw = job?.experience_id ?? job?.experience ?? (typeof job?.experiences === 'string' ? job.experiences.split(',')[0] : job?.experiences?.[0]);
  const experience = toSingleSelect(experienceRaw) ?? toSingleSelectFromId(typeof experienceRaw === 'string' ? experienceRaw : experienceRaw?._id);

  // Certification
  const certificationRaw = job?.certification_id ?? job?.certification ?? (typeof job?.certifications === 'string' ? job.certifications.split(',')[0] : job?.certifications?.[0]);
  const certification = toSingleSelect(certificationRaw) ?? toSingleSelectFromId(typeof certificationRaw === 'string' ? certificationRaw : certificationRaw?._id);

  // Languages: now array of IDs
  const languages = toIdArray(job?.languages);

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

  return {
    education,
    experience,
    certification,
    languages,
    other_requirements,
    skillId,
    jobSkills,
  };
};
