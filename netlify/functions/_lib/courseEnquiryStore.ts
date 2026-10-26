import type { CourseEnquiry } from './validation';

const courseEnquiries: CourseEnquiry[] = [];

export function recordCourseEnquiry(enquiry: CourseEnquiry): void {
  courseEnquiries.push(enquiry);
  console.log(`[IAMTECHNI Training] New enquiry logged:`, {
    referenceId: enquiry.id,
    fullName: enquiry.fullName,
    course: enquiry.course,
    mobileNumber: enquiry.mobileNumber,
  });
}

export function getCourseEnquiriesCount(): number {
  return courseEnquiries.length;
}
