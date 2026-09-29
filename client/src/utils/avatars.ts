export const getEmployeeAvatar = (name: string, employeeId?: string): string => {
  const n = (name || '').toLowerCase();
  const id = (employeeId || '').toUpperCase();

  if (n.includes('mahbub') || id === 'EMP-101') return '/assets/mahbub_alam.jpg';
  if (n.includes('arif') || id === 'EMP-102') return '/assets/arif_hossain.jpg';
  if (n.includes('tanzina') || id === 'EMP-103') return '/assets/tanzina_akhter.jpg';
  if (n.includes('kamrul') || id === 'EMP-104') return '/assets/kamrul_islam.jpg';
  if (n.includes('sadia') || id === 'EMP-105') return '/assets/sadia_jahan.jpg';
  if (n.includes('farhan') || id === 'EMP-106') return '/assets/farhan_ahmed.jpg';

  return '/assets/mahbub_alam.jpg';
};
