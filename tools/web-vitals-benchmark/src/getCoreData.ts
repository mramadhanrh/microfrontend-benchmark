export const getSpeedIndex = (lighthouseResult: any): number => {
  return lighthouseResult.audits['speed-index'].numericValue as number;
};

export const getFirstContentfulPaint = (lighthouseResult: any): number => {
  return lighthouseResult.audits['first-contentful-paint']
    .numericValue as number;
};

export const getLargestContentfulPaint = (lighthouseResult: any): number => {
  return lighthouseResult.audits['largest-contentful-paint']
    .numericValue as number;
};

export const getCumulativeLayoutShift = (lighthouseResult: any): number => {
  return lighthouseResult.audits['cumulative-layout-shift']
    .numericValue as number;
};
export const getTimeToInteractive = (lighthouseResult: any): number => {
  return lighthouseResult.audits['interactive'].numericValue as number;
};

export const getTotalBlockingTime = (lighthouseResult: any): number => {
  return lighthouseResult.audits['total-blocking-time'].numericValue as number;
};

export const getCoreData = (lighthouseResult: any) => {
  return {
    speedIndex: getSpeedIndex(lighthouseResult),
    firstContentfulPaint: getFirstContentfulPaint(lighthouseResult),
    largestContentfulPaint: getLargestContentfulPaint(lighthouseResult),
    cumulativeLayoutShift: getCumulativeLayoutShift(lighthouseResult),
    timeToInteractive: getTimeToInteractive(lighthouseResult),
    totalBlockingTime: getTotalBlockingTime(lighthouseResult),
  };
};

export default getCoreData;
